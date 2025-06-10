// Global notification system
let notifications = []
const MAX_NOTIFICATIONS = 4

// DOM elements
const notificationBadge = document.querySelector(".notification-badge")
const notificationList = document.getElementById("notification-list")
const bellIcon = document.querySelector(".bell i")

// Initialize notifications when page loads
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

	loadNotificationsFromStorage()
	renderNotifications()

	// Set up logout functionality
	const logOutButton = document.querySelector("#log-out")
	if (logOutButton) {
		logOutButton.addEventListener("click", async e => {
			e.preventDefault()

			try {
				const response = await fetch("/pvi/logout", {
					method: "POST",
				})

				if (response.ok) {
					window.location.href = "/pvi/auth/logIn"
				} else {
					console.error("Logout failed.")
				}
			} catch (error) {
				console.error("Error during logout:", error)
			}
		})
	}
})

// Socket event handlers for notifications
if (typeof socket !== "undefined") {
	socket.on("newNotification", data => {
		console.log("New notification received:", data)
		addNotification(data)
		showNotificationBadge()
		startRingAnimation()
	})
}

async function addNotification(data) {
	const notification = {
		id: Date.now(),
		roomName: data.room.name,
		senderName: `User ${data.message.sender_mysql_user_id}`, // Fallback name
		message: data.message.content,
		timestamp: new Date(data.message.timestamp),
		roomId: data.room._id,
	}

	// Try to get the actual sender name
	try {
		// First check if users array is available (from messages.js)
		if (typeof users !== "undefined" && users.length > 0) {
			const sender = users.find(user => user.id === data.message.sender_mysql_user_id)
			if (sender) {
				notification.senderName = sender.name
			}
		} else {
			// Fetch from server
			const response = await fetch(`/pvi/students/getById/${data.message.sender_mysql_user_id}`)
			if (response.ok) {
				const userData = await response.json()
				if (userData.success) {
					notification.senderName = `${userData.data.firstName} ${userData.data.lastName}`
				}
			}
		}
	} catch (error) {
		console.error("Error fetching sender name:", error)
		// Keep fallback name
	}

	// Add to beginning of array
	notifications.unshift(notification)

	// Keep only the latest 4 notifications
	if (notifications.length > MAX_NOTIFICATIONS) {
		notifications = notifications.slice(0, MAX_NOTIFICATIONS)
	}

	saveNotificationsToStorage()
	renderNotifications()
}

function renderNotifications() {
	if (!notificationList) return

	if (notifications.length === 0) {
		notificationList.innerHTML = '<li class="no-notifications">No new messages</li>'
		return
	}

	const notificationItems = notifications
		.map(
			notification => `
        <li onclick="openNotification('${notification.roomId}', '${notification.id}')" style="cursor: pointer;">
            <img src="/pvi/assets/img/gossip-t.jpg" alt="${notification.senderName}">
            <div class="message-info">
                <p class="name">${notification.senderName}</p>
                <p class="message">${
					notification.message.length > 30
						? notification.message.substring(0, 30) + "..."
						: notification.message
				}</p>
                <p class="room-name" style="font-size: 11px; color: #666;">${notification.roomName}</p>
            </div>
        </li>
    `
		)
		.join("")

	notificationList.innerHTML =
		notificationItems +
		`
        <li class="clear-all-container">
            <button onclick="clearAllNotifications()" class="clear-all-btn">Clear All</button>
        </li>
    `
}

function openNotification(roomId, notificationId) {
	// Remove the specific notification when clicked
	if (notificationId) {
		notifications = notifications.filter(n => n.id != notificationId)
		saveNotificationsToStorage()
		renderNotifications()

		if (notifications.length === 0) {
			hideNotificationBadge()
		}
	}

	// Navigate to messages page and open specific room
	if (window.location.pathname.includes("messages")) {
		// If already on messages page, just select the room
		if (typeof selectAndJoinRoom === "function") {
			selectAndJoinRoom(roomId)
		}
	} else {
		// Navigate to messages page with room ID in hash
		window.location.href = `/pvi/messages#room=${roomId}`
	}

	// Hide notification badge when opening notification
	hideNotificationBadge()
}

function showNotificationBadge() {
	if (notificationBadge) {
		notificationBadge.style.display = "block"
	}
}

function hideNotificationBadge() {
	if (notificationBadge) {
		notificationBadge.style.display = "none"
	}
}

function startRingAnimation() {
	if (bellIcon) {
		bellIcon.classList.add("ring-animation")

		// Remove animation after 2 seconds
		setTimeout(() => {
			bellIcon.classList.remove("ring-animation")
		}, 2000)
	}
}

function saveNotificationsToStorage() {
	try {
		localStorage.setItem("chat_notifications", JSON.stringify(notifications))
	} catch (error) {
		console.error("Error saving notifications to storage:", error)
	}
}

function loadNotificationsFromStorage() {
	try {
		const stored = localStorage.getItem("chat_notifications")
		if (stored) {
			notifications = JSON.parse(stored)
			// Convert timestamp strings back to Date objects
			notifications.forEach(notification => {
				notification.timestamp = new Date(notification.timestamp)
			})
		}
	} catch (error) {
		console.error("Error loading notifications from storage:", error)
		notifications = []
	}
}

function clearNotifications() {
	notifications = []
	saveNotificationsToStorage()
	renderNotifications()
	hideNotificationBadge()
}

function clearAllNotifications() {
	notifications = []
	saveNotificationsToStorage()
	renderNotifications()
	hideNotificationBadge()
}

// Export functions for use in other scripts
window.addNotification = addNotification
window.clearNotifications = clearNotifications
window.clearAllNotifications = clearAllNotifications
window.openNotification = openNotification
