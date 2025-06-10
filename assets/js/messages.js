let currentActiveRoomId = null
let userRooms = null
let users = [] // Will be populated from server

// Chat switching functionality
const chatRoomsList = document.querySelector(".chat-item-container")
const chatHeader = document.querySelector(".chat-header h3")
const chatMembers = document.querySelector(".chat-members")
const chatMessages = document.querySelector(".chat-messages")

// Send message functionality
const messageInput = document.querySelector(".message-input")
const sendBtn = document.querySelector(".send-btn")

function sendMessage() {
	const text = messageInput.value.trim()
	if (text && currentActiveRoomId) {
		socket.emit("sendMessage", {
			content: text,
			roomId: currentActiveRoomId,
		})
		messageInput.value = ""
	}
}

function renderChatRooms(rooms) {
	chatRoomsList.innerHTML = ""

	rooms.forEach(room => {
		const chatRoomDiv = document.createElement("div")
		chatRoomDiv.className = "chat-item"
		chatRoomDiv.dataset.roomid = room._id
		chatRoomDiv.innerHTML = `
            <img src="/pvi/assets/img/gossip-t.jpg">
            <div class="chat-item-info">
                <div class="chat-item-name">${room.name}</div>
            </div>
        `

		chatRoomDiv.addEventListener("click", () => {
			selectAndJoinRoom(room._id)
		})

		chatRoomsList.appendChild(chatRoomDiv)
	})

	highlightActiveRoom(currentActiveRoomId)
}

function highlightActiveRoom(activeRoomId) {
	if (!activeRoomId) return

	chatRoomsList.querySelectorAll(".chat-item").forEach(chatRoom => {
		if (chatRoom.dataset.roomid === activeRoomId) {
			chatRoom.classList.add("active")
		} else {
			chatRoom.classList.remove("active")
		}
	})
}

function selectAndJoinRoom(roomId) {
	if (!roomId) return

	console.log(`Attempting to select and join room: ${roomId}`)

	currentActiveRoomId = roomId
	socket.emit("joinRoom", { roomId: roomId })
}

async function appendMessageToChat(message) {
	const messageDiv = document.createElement("div")
	messageDiv.className = "message"

	// Find user info for the sender - fetch from PHP server
	let senderName = `User ${message.sender_mysql_user_id}` // Fallback name
	const senderAvatar = "/pvi/assets/img/gossip-t.jpg" // Default avatar

	try {
		// Find user in local users array first
		const localUser = users.find(user => user.id === message.sender_mysql_user_id)
		if (localUser) {
			senderName = localUser.name
		} else {
			// If not found locally, fetch from server
			const response = await fetch(`/pvi/students/getById/${message.sender_mysql_user_id}`)
			if (response.ok) {
				const userData = await response.json()
				if (userData.success) {
					senderName = `${userData.data.firstName} ${userData.data.lastName}`
				}
			}
		}
	} catch (error) {
		console.error("Error fetching user data:", error)
		// Keep fallback name if error occurs
	}

	messageDiv.innerHTML = `
		<img src="${senderAvatar}" alt="${senderName}">
		<div class="message-content">
			<div class="message-author">${senderName}</div>
			<div class="message-text">${message.content}</div>
		</div>
	`

	chatMessages.appendChild(messageDiv)
}

// Fetch users from server
async function fetchUsers() {
	try {
		const response = await fetch("/pvi/students/getAll?page=1&limit=1000")
		const data = await response.json()
		users = data.data.map(student => ({
			id: student.id,
			name: `${student.firstName} ${student.lastName}`,
			avatar: "/pvi/assets/img/gossip-t.jpg",
		}))

		// Make users globally available for notifications
		window.users = users

		renderUsers(users)
	} catch (error) {
		console.error("Error fetching users:", error)
	}
}

sendBtn.addEventListener("click", sendMessage)
messageInput.addEventListener("keypress", e => {
	if (e.key === "Enter") {
		sendMessage()
	}
})

// Handle opening room from URL hash
function handleOpenFromHash() {
	const hash = window.location.hash
	if (!hash.startsWith("#room=")) {
		return
	}

	const roomId = hash.substring(6)
	if (!roomId) {
		return
	}

	const attemptToJoinRoom = () => {
		if (userRooms && userRooms.length) {
			const room = userRooms.find(r => r._id === roomId)
			if (room) selectAndJoinRoom(roomId)

			window.history.replaceState(null, null, window.location.pathname)
		} else {
			setTimeout(attemptToJoinRoom, 1000)
		}
	}
	attemptToJoinRoom()
}

// Socket event handlers
socket.on("chat_connected", data => {
	console.log("Chat connected:", data)
	fetchUsers() // Load users when connected
	handleOpenFromHash() // Check if we need to open a specific room
})

socket.on("userRoomsList", rooms => {
	console.log("Received user rooms list:", rooms)
	userRooms = rooms
	renderChatRooms(rooms)
})

socket.on("roomCreated", newRoom => {
	console.log("Room created successfully:", newRoom)

	if (!userRooms.find(r => r._id === newRoom._id)) {
		userRooms.unshift(newRoom)
	} else {
		userRooms = userRooms.map(r => (r._id === newRoom._id ? newRoom : r))
	}

	userRooms.sort((a, b) => new Date(b.last_message_timestamp) - new Date(a.last_message_timestamp))
	renderChatRooms(userRooms)
	selectAndJoinRoom(newRoom._id)
	closeModalHandler() // Close the modal
})

socket.on("addedToNewRoom", newRoom => {
	console.log("You were added to a new room:", newRoom)

	if (!userRooms.find(r => r._id === newRoom._id)) {
		userRooms.unshift(newRoom)
		userRooms.sort((a, b) => new Date(b.last_message_timestamp) - new Date(a.last_message_timestamp))
		renderChatRooms(userRooms)
	}
})

socket.on("joinedRoomSuccess", data => {
	console.log(`Successfully joined room: ${data.roomName} (ID: ${data.roomId})`)

	currentActiveRoomId = data.roomId
	chatHeader.textContent = `Chat room ${data.roomData.name}`
	displayRoomMembers(data.roomParticipants, data.roomData)

	highlightActiveRoom(data.roomId)
})

socket.on("roomMessages", async data => {
	if (data.roomId === currentActiveRoomId) {
		console.log(`Received messages for room ${data.roomId}:`, data.messages)

		chatMessages.innerHTML = ""

		for (const msg of data.messages) {
			await appendMessageToChat(msg)
		}

		chatMessages.scrollTop = chatMessages.scrollHeight
	}
})

socket.on("newMessage", async message => {
	console.log("New message received:", message)

	if (message.room_id === currentActiveRoomId) {
		await appendMessageToChat(message)
		chatMessages.scrollTop = chatMessages.scrollHeight
	}
})

socket.on("roomError", error => {
	console.error("Room error:", error)
	alert(error.message)
})

socket.on("messageError", error => {
	console.error("Message error:", error)
	alert(error.message)
})

socket.on("membersAddedSuccessfully", data => {
	console.log("Members added successfully:", data)
	// Update the room data if it's the current room
	if (data.roomId === currentActiveRoomId) {
		displayRoomMembers(data.updatedRoom.participant_mysql_user_ids, data.updatedRoom)
	}
	closeModalHandler()
})

socket.on("roomUpdated", updatedRoom => {
	console.log("Room updated:", updatedRoom)
	// Update local room data
	userRooms = userRooms.map(r => (r._id === updatedRoom._id ? updatedRoom : r))
	if (updatedRoom._id === currentActiveRoomId) {
		displayRoomMembers(updatedRoom.participant_mysql_user_ids, updatedRoom)
	}
})

let selectedMembers = []
let isAddingToExistingChat = false

// Modal elements
const modal = document.getElementById("chatModal")
const newChatBtn = document.getElementById("newChatBtn")
const addMembersBtn = document.getElementById("addMembersBtn")
const closeModal = document.getElementById("closeModal")
const cancelBtn = document.getElementById("cancelBtn")
const createChatBtn = document.getElementById("createChatBtn")
const memberSearch = document.getElementById("memberSearch")
const usersList = document.getElementById("usersList")
const chatNameInput = document.getElementById("chatName")
const modalTitle = document.getElementById("modalTitle")
const selectedMembersContainer = document.getElementById("selectedMembersContainer")
const selectedMemberTags = document.getElementById("selectedMemberTags")

// Event listeners
newChatBtn.addEventListener("click", () => openModal(false))
addMembersBtn.addEventListener("click", () => openModal(true))
closeModal.addEventListener("click", closeModalHandler)
cancelBtn.addEventListener("click", closeModalHandler)
createChatBtn.addEventListener("click", handleCreateChat)
memberSearch.addEventListener("input", handleSearch)

// Close modal when clicking outside
window.addEventListener("click", event => {
	if (event.target === modal) {
		closeModalHandler()
	}
})

function openModal(addingToExisting = false) {
	isAddingToExistingChat = addingToExisting
	selectedMembers = []

	if (addingToExisting) {
		modalTitle.textContent = "Add Members to Chat"
		chatNameInput.parentElement.style.display = "none"
		createChatBtn.textContent = "Add Members"
	} else {
		modalTitle.textContent = "Create New Chat Room"
		chatNameInput.parentElement.style.display = "block"
		createChatBtn.textContent = "Create Chat"
		chatNameInput.value = ""
	}

	memberSearch.value = ""
	renderUsers(users)
	updateSelectedMembers()
	modal.style.display = "block"

	// Focus on appropriate input
	setTimeout(() => {
		if (addingToExisting) {
			memberSearch.focus()
		} else {
			chatNameInput.focus()
		}
	}, 100)
}

function closeModalHandler() {
	modal.style.display = "none"
	selectedMembers = []
	chatNameInput.value = ""
	memberSearch.value = ""
}

function handleSearch() {
	const searchTerm = memberSearch.value.toLowerCase().trim()

	if (searchTerm === "") {
		renderUsers(users)
		return
	}

	const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm))
	renderUsers(filteredUsers)
}

function renderUsers(usersToRender) {
	if (usersToRender.length === 0) {
		usersList.innerHTML = '<div class="no-results">No users found</div>'
		return
	}

	usersList.innerHTML = usersToRender
		.map(
			user => `
        <div class="user-item ${selectedMembers.includes(user.id) ? "selected" : ""}" 
                data-user-id="${user.id}" onclick="toggleUser(${user.id})">
            <img src="${user.avatar}" alt="${user.name}">
            <div class="user-item-info">
                <p class="user-name">${user.name}</p>
            </div>
        </div>
    `
		)
		.join("")
}

function toggleUser(userId) {
	const userIndex = selectedMembers.indexOf(userId)

	if (userIndex > -1) {
		selectedMembers.splice(userIndex, 1)
	} else {
		selectedMembers.push(userId)
	}

	updateSelectedMembers()
	renderUsers(
		users.filter(
			user => memberSearch.value === "" || user.name.toLowerCase().includes(memberSearch.value.toLowerCase())
		)
	)
}

function updateSelectedMembers() {
	if (selectedMembers.length === 0) {
		selectedMembersContainer.style.display = "none"
		createChatBtn.disabled = isAddingToExistingChat ? false : true
		return
	}

	selectedMembersContainer.style.display = "block"

	const selectedUsers = users.filter(user => selectedMembers.includes(user.id))
	selectedMemberTags.innerHTML = selectedUsers
		.map(
			user => `
        <div class="member-tag">
            ${user.name}
            <span class="remove-member" onclick="removeUser(${user.id})">&times;</span>
        </div>
    `
		)
		.join("")

	// Enable create button if we have members (and chat name for new chats)
	if (isAddingToExistingChat) {
		createChatBtn.disabled = false
	} else {
		createChatBtn.disabled = selectedMembers.length === 0 || chatNameInput.value.trim() === ""
	}
}

function removeUser(userId) {
	const userIndex = selectedMembers.indexOf(userId)
	if (userIndex > -1) {
		selectedMembers.splice(userIndex, 1)
		updateSelectedMembers()
		renderUsers(
			users.filter(
				user => memberSearch.value === "" || user.name.toLowerCase().includes(memberSearch.value.toLowerCase())
			)
		)
	}
}

function handleCreateChat() {
	if (isAddingToExistingChat) {
		// Add members to existing chat
		if (!currentActiveRoomId) {
			alert("Please select a chat room first")
			return
		}

		socket.emit("addMembersToRoom", {
			roomId: currentActiveRoomId,
			newUserIdsToAdd: selectedMembers,
		})
	} else {
		// Create new chat
		const chatName = chatNameInput.value.trim()

		if (!chatName) {
			alert("Please enter a chat room name")
			return
		}

		if (selectedMembers.length === 0) {
			alert("Please select at least one member")
			return
		}

		socket.emit("createRoom", {
			roomName: chatName,
			participantIds: selectedMembers,
		})
	}
}

chatNameInput.addEventListener("input", () => {
	if (!isAddingToExistingChat) {
		createChatBtn.disabled = selectedMembers.length === 0 || chatNameInput.value.trim() === ""
	}
})

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
	// Initialize user name from sessionStorage
	const firstName = sessionStorage.getItem("first_name")
	const lastName = sessionStorage.getItem("last_name")

	if (firstName && lastName) {
		const userNameElement = document.querySelector(".user-name")
		if (userNameElement) {
			userNameElement.textContent = `${firstName} ${lastName}`
		}
	}

	// Wait for socket connection before fetching users
	if (socket.connected) {
		fetchUsers()
		handleOpenFromHash()
	}
})

async function displayRoomMembers(participantIds, roomData) {
	const memberCount = participantIds.length

	try {
		// Get online status for all participants
		const onlineResponse = await fetch("/pvi/students/getAll?page=1&limit=1000")
		const onlineData = await onlineResponse.json()
		const onlineUsers = onlineData.data.filter(student => student.isOnline === 1)

		// Build member list with names and online status
		const memberNames = []

		for (const participantId of participantIds) {
			let memberName = `User ${participantId}`
			let isOnline = false

			// Check local users array first
			const localUser = users.find(user => user.id === participantId)
			if (localUser) {
				memberName = localUser.name
				isOnline = onlineUsers.some(user => user.id === participantId)
			} else {
				// Fetch from server if not in local array
				try {
					const response = await fetch(`/pvi/students/getById/${participantId}`)
					if (response.ok) {
						const userData = await response.json()
						if (userData.success) {
							memberName = `${userData.data.firstName} ${userData.data.lastName}`
							isOnline = userData.data.isOnline === 1
						}
					}
				} catch (error) {
					console.error("Error fetching member data:", error)
				}
			}

			// Add styling for online status
			if (isOnline) {
				memberNames.push(`<span class="online-member">${memberName}</span>`)
			} else {
				memberNames.push(`<span class="offline-member">${memberName}</span>`)
			}
		}

		chatMembers.innerHTML = `
			<div class="member-count">${memberCount} members</div>
			<div class="member-list">${memberNames.join(", ")}</div>
		`
	} catch (error) {
		console.error("Error displaying room members:", error)
		chatMembers.textContent = `${memberCount} members`
	}
}
