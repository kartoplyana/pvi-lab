<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Messages</title>
    <link rel="icon" type="image/x-icon" href="/pvi/assets/img/favicon.ico">
    <link rel="stylesheet" href="/pvi/assets/css/students.css" />
    <link rel="stylesheet" href="/pvi/assets/css/messages.css" />
    <link rel="stylesheet" href="/pvi/assets/css/modal-window.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">
</head>

<body>
    <header>
        <div class="header-left">
            <span>
                <i class="fa-solid fa-frog" style="color: #b44b28;font-size: 24px;"></i>
            </span>
            <a href="/pvi/students/index" class="logo">Studentsy</a>
        </div>

        <div class="header-right">
            <div class="notification-container">
                <a href="/pvi/messages" class="bell" aria-label="notifications">
                    <i class="fa-solid fa-bell"></i>
                    <span class="notification-badge" style="display: none;"></span>
                </a>

                <div class="notification-dropdown">
                    <h3>New Messages</h3>
                    <ul id="notification-list">
                        <!-- Notifications will be populated here -->
                    </ul>
                </div>
            </div>

            <div class="user-container">
                <div class="user-profile">
                    <img src="/pvi/assets/img/gossip-t.jpg" alt="user-picture">
                    <p class="user-name">Polina Bakhmetieva</p>
                </div>

                <div class="profile-dropdown">
                    <ul>
                        <li>
                            <p id="profile">Profile</p>
                        </li>
                        <li>
                            <p id="log-out">Log Out</p>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </header>

    <main>
        <aside>
            <ul>
                <li><a href="/pvi/dashbord" class="nav-link">Dashboard</a></li>
                <li><a href="/pvi/students/index" class="nav-link">Students</a></li>
                <li><a href="/pvi/messages" class="nav-link active-nav">Messages</a></li>
            </ul>
        </aside>

        <div class="content">
            <h1>Messages</h1>

            <div class="messages-container">
                <div class="chat-list">
                    <h3>Chat room</h3>
                    <button class="new-chat-btn" id="newChatBtn">+ New chat room</button>

                    <div class="chat-item-container">
                        <!-- Chat rooms will be populated here -->
                    </div>
                </div>

                <div class="chat-area">
                    <div class="chat-header">
                        <div class="chat-header-left">
                            <h3>Select a chat room</h3>
                            <div class="chat-members"></div>
                        </div>
                        <button class="add-members-btn" id="addMembersBtn">
                            <i class="fa-solid fa-user-plus"></i> Add Members
                        </button>
                    </div>

                    <div class="chat-messages">
                        <!-- Messages will be populated here -->
                    </div>

                    <div class="message-input-area">
                        <input type="text" class="message-input" placeholder="Type your message...">
                        <button class="send-btn">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Modal -->
    <div id="chatModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle">Create New Chat Room</h2>
                <span class="close" id="closeModal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="chatName">Chat Room Name</label>
                    <input type="text" id="chatName" placeholder="Enter chat room name...">
                </div>

                <div class="members-section">
                    <label>Add Members</label>
                    <div class="search-container">
                        <i class="fa-solid fa-search search-icon"></i>
                        <input type="text" class="search-input" id="memberSearch" placeholder="Search by name or surname...">
                    </div>

                    <div class="users-list" id="usersList">
                        <!-- Users will be populated here -->
                    </div>

                    <div class="selected-members" id="selectedMembersContainer" style="display: none;">
                        <h4>Selected Members:</h4>
                        <div class="selected-member-tags" id="selectedMemberTags"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
                <button class="btn btn-primary" id="createChatBtn">Create Chat</button>
            </div>
        </div>
    </div>

    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script src="/pvi/assets/js/clientSocket.js"></script>
    <script src="/pvi/assets/js/notifications.js"></script>
    <script src="/pvi/assets/js/messages.js"></script>
    <script>
        // Initialize user name from sessionStorage
        document.addEventListener('DOMContentLoaded', function() {
            const firstName = sessionStorage.getItem('first_name');
            const lastName = sessionStorage.getItem('last_name');

            if (firstName && lastName) {
                const userNameElement = document.querySelector('.user-name');
                if (userNameElement) {
                    userNameElement.textContent = `${firstName} ${lastName}`;
                }
            }
        });
    </script>
</body>

</html>