import express from "express"
import http from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"

const MONGO_URL = "mongodb://localhost:27017/pvi_messages"
const connectedUsers = new Map() // mysql_user_id -> socket_id

function findSocketIdByUserId(mySqlUserId) {
	const userIdInt = parseInt(mySqlUserId, 10)
	for (const [userId, socketId] of connectedUsers.entries()) if (userId === userIdInt) return socketId

	return null
}

async function connectToMongoDB() {
	try {
		await mongoose.connect(MONGO_URL)
		console.log(`Successfully connected to MongoDB: ${mongoose.connection.name}`)
	} catch (err) {
		console.error("Failed to connect to Mongo DB :(", err)
		process.exit(1)
	}
}
connectToMongoDB()

const messageSchema = new mongoose.Schema({
	content: { type: String, required: true, trim: true },
	sender_mysql_user_id: { type: Number, required: true },
	room_id: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true },
	timestamp: { type: Date, default: Date.now },
})
const Message = mongoose.model("Message", messageSchema)

const chatRoomSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	creator_mysql_user_id: { type: Number, required: true },
	participant_mysql_user_ids: [{ type: Number }],
	is_group_chat: { type: Boolean, default: true },
	last_message_timestamp: { type: Date, default: Date.now },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
})
chatRoomSchema.pre("save", function (next) {
	this.updated_at = Date.now()
	if (this.isNew) this.last_message_timestamp = this.created_at

	next()
})
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema)

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: "http://localhost",
		methods: ["GET", "POST"],
	},
})

io.on("connection", async socket => {
	console.log("A user is trying to connect...")

	const userId = socket.handshake.auth.userId

	if (!userId) {
		console.log("Failed to get userId. Disconnecting.")
		socket.disconnect(true)

		return
	}

	try {
		socket.mysql_user_id = userId

		console.log(`User with MySQL ID ${socket.mysql_user_id} connected! (Socket ID: ${socket.id})`)

		connectedUsers.set(socket.mysql_user_id, socket.id)

		socket.emit("chat_connected", {
			mysql_user_id: socket.mysql_user_id,
			socket_id: socket.id,
		})

		try {
			const userRooms = await ChatRoom.find({ participant_mysql_user_ids: socket.mysql_user_id }).sort({
				last_message_timestamp: -1,
			})
			socket.emit(
				"userRoomsList",
				userRooms.map(r => r.toObject())
			)
		} catch (err) {
			console.error("Error loading user rooms: ", err)
			socket.emit("roomError", { message: "Could not load your rooms." })
		}

		socket.on("createRoom", async data => {
			console.log("Create room request:", data)

			if (!data || !data.roomName || !data.participantIds || !Array.isArray(data.participantIds)) {
				socket.emit("roomError", {
					message: "Invalid room creation data.",
				})
				return
			}
			if (!data.participantIds.includes(socket.mysql_user_id)) data.participantIds.push(socket.mysql_user_id)

			const uniqueParticipants = [...new Set(data.participantIds.map(id => parseInt(id, 10)))]

			try {
				const newRoom = new ChatRoom({
					name: data.roomName.trim(),
					creator_mysql_user_id: socket.mysql_user_id,
					participant_mysql_user_ids: uniqueParticipants,
					is_group_chat: uniqueParticipants.length > 2,
				})
				const savedRoom = await newRoom.save()
				const roomObject = savedRoom.toObject()

				socket.join(savedRoom._id.toString())
				console.log(
					`User ${socket.mysql_user_id} created and joined room: ${savedRoom.name}` + `(ID: ${savedRoom._id})`
				)

				socket.emit("roomCreated", roomObject)

				for (const participantId of roomObject.participant_mysql_user_ids) {
					if (participantId !== socket.mysql_user_id) {
						const targetSocketId = findSocketIdByUserId(participantId)

						if (targetSocketId) {
							io.to(targetSocketId).emit("addedToNewRoom", roomObject)

							const targetSocket = io.sockets.sockets.get(targetSocketId)
							if (targetSocket) {
								targetSocket.join(roomObject._id.toString())
								console.log(
									`User ${participantId} (Socket ${targetSocketId}) auto-joined new room ${roomObject._id}`
								)
							}
						}
					}
				}
			} catch (err) {
				console.error("Error creating room:", err)
				socket.emit("roomError", { message: "Could not create room." })
			}
		})

		socket.on("joinRoom", async data => {
			if (!data || !data.roomId) {
				socket.emit("roomError", {
					message: "Room ID not provided for joining.",
				})
				return
			}

			try {
				const room = await ChatRoom.findById(data.roomId)

				if (room && room.participant_mysql_user_ids.includes(socket.mysql_user_id)) {
					socket.rooms.forEach(r => {
						if (r !== socket.id) socket.leave(r)
					})

					socket.join(data.roomId)
					console.log(`User ${socket.mysql_user_id} joined room: ${room.name} (ID: ${data.roomId})`)

					socket.emit("joinedRoomSuccess", {
						roomId: data.roomId,
						roomName: room.name,
						roomParticipants: [...room.participant_mysql_user_ids],
						roomData: room.toObject(),
					})

					const messages = await Message.find({ room_id: data.roomId }).sort({ timestamp: 1 }).limit(50)
					socket.emit("roomMessages", {
						roomId: data.roomId,
						messages: messages.map(m => m.toObject()),
					})
				} else {
					socket.emit("roomError", { message: "Cannot join room or room not found." })
				}
			} catch (err) {
				console.error(`Error joining room ${data.roomId}:`, err)
				socket.emit("roomError", { message: "Error joining room." })
			}
		})

		socket.on("sendMessage", async data => {
			if (mongoose.connection.readyState !== 1) {
				socket.emit("messageError", { message: "Server error: DB not connected." })
				return
			}
			if (!data || data.content.trim() === "" || !data.roomId) {
				console.log("Received empty, invalid message data, or missing roomId.")
				socket.emit("messageError", { message: "Invalid message or no room selected." })

				return
			}

			const messageContent = data.content.trim()
			const roomId = data.roomId

			if (!socket.rooms.has(roomId)) {
				console.warn(
					`User ${socket.mysql_user_id} (socket ${socket.id}) tried to send to room ` +
						`${roomId} they haven't joined (socket-wise). Validating and attempting auto-join.`
				)

				const roomData = await ChatRoom.findById(roomId)

				if (roomData && roomData.participant_mysql_user_ids.includes(socket.mysql_user_id)) {
					socket.rooms.forEach(r => {
						if (r !== socket.id) socket.leave(r)
					})
					socket.join(roomId)
					console.log(`Auto-joined ${socket.mysql_user_id} to socket room ${roomId}`)
				} else {
					socket.emit("messageError", {
						message: "You are not part of this chat room or room does not exist.",
					})

					return
				}
			}

			console.log(`Message from ${socket.mysql_user_id} to room ${roomId}: ${messageContent}`)
			const messageObject = {
				content: messageContent,
				sender_mysql_user_id: socket.mysql_user_id,
				room_id: roomId,
			}

			try {
				const newMessage = new Message(messageObject)
				const savedMessage = await newMessage.save()
				const room = await ChatRoom.findByIdAndUpdate(roomId, {
					last_message_timestamp: savedMessage.timestamp,
				})

				io.to(roomId).emit("newMessage", savedMessage.toObject())
				console.log(
					`Message from ${socket.mysql_user_id} to room ${roomId} broadcasted ` +
						`and saved (ID: ${savedMessage._id})`
				)

				for (const participantId of room.participant_mysql_user_ids) {
					if (participantId === socket.mysql_user_id) continue

					const targetSocketId = findSocketIdByUserId(participantId)

					if (targetSocketId) {
						const targetSocket = io.sockets.sockets.get(targetSocketId)

						if (targetSocket && !targetSocket.rooms.has(roomId)) {
							io.to(targetSocketId).emit("newNotification", {
								room,
								message: savedMessage.toObject(),
							})

							console.log(
								`Sent new notification to user ${participantId} (socket ${targetSocketId}) for room ${roomId}`
							)
						}
					}
				}
			} catch (err) {
				console.error("Error saving or broadcasting message:", err)
				socket.emit("messageError", { message: "Could not send message due to server error." })
			}
		})

		socket.on("addMembersToRoom", async data => {
			try {
				console.log(data)
				const { roomId, newUserIdsToAdd } = data

				if (!roomId || !newUserIdsToAdd || !Array.isArray(newUserIdsToAdd) || newUserIdsToAdd.length === 0)
					return socket.emit("roomError", {
						message: "Invalid data for adding members (roomId and newUserIdsToAdd are required).",
					})
				if (!mongoose.Types.ObjectId.isValid(roomId))
					return socket.emit("roomError", { message: "Invalid Room ID format." })

				const room = await ChatRoom.findById(roomId)

				if (!room) return socket.emit("roomError", { message: "Room not found." })
				if (!room.participant_mysql_user_ids.includes(socket.mysql_user_id))
					return socket.emit("roomError", { message: "You are not authorized to add members to this room." })

				const uniqueNewUserIds = newUserIdsToAdd
					.map(id => parseInt(id, 10))
					.filter(id => !isNaN(id) && !room.participant_mysql_user_ids.includes(id))

				if (uniqueNewUserIds.length === 0)
					return socket.emit("roomError", {
						message: "No new valid members to add, or selected users are already in the room.",
					})

				room.participant_mysql_user_ids.push(...uniqueNewUserIds)
				await room.save()

				const roomObject = room.toObject()

				const existingMembersToNotify = roomObject.participant_mysql_user_ids.filter(
					id => !uniqueNewUserIds.includes(id)
				)
				existingMembersToNotify.forEach(participantId => {
					const targetSocketId = findSocketIdByUserId(participantId)
					if (targetSocketId) {
						io.to(targetSocketId).emit("roomUpdated", roomObject)
					}
				})

				uniqueNewUserIds.forEach(newMemberId => {
					const targetSocketId = findSocketIdByUserId(newMemberId)
					if (targetSocketId) {
						const targetSocketInstance = io.sockets.sockets.get(targetSocketId)
						if (targetSocketInstance) {
							targetSocketInstance.join(roomObject._id.toString())
							targetSocketInstance.emit("addedToNewRoom", roomObject)

							console.log(
								`User ${newMemberId} (Socket ${targetSocketId}) added to room ${roomObject._id}`
							)
						}

						if (targetSocketInstance) {
							targetSocketInstance.join(roomObject._id.toString())
							targetSocketInstance.emit("addedToNewRoom", roomObject)

							console.log(
								`User ${newMemberId} (Socket ${targetSocketId}) was added to room ${roomObject._id} and joined its Socket.IO channel.`
							)
						}
					}
				})

				socket.emit("membersAddedSuccessfully", {
					roomId: roomObject._id.toString(),
					addedUserIds: uniqueNewUserIds,
					updatedRoom: roomObject,
				})

				console.log(
					`Users [${uniqueNewUserIds.join(", ")}] added to room ${roomId} by user ${socket.mysql_user_id}`
				)
			} catch (error) {
				console.error("Error in addMembersToRoom:", error)
				socket.emit("roomError", { message: "Server error while adding members. " + error.message })
			}
		})
	} catch (error) {
		console.error(error)

		socket.disconnect(true)
		return
	}

	socket.on("disconnect", () => {
		if (socket.mysql_user_id) {
			connectedUsers.delete(socket.mysql_user_id)

			console.log(`User ${socket.mysql_user_id} disconnected (Socket ID: ${socket.id})`)
		} else {
			console.log(`Socket ${socket.id} disconnected (was not fully authenticated).`)
		}
	})
})

const PORT = 3000
server.listen(PORT, () => {
	console.log(`Chat server is running on http://localhost:${PORT}`)
})
