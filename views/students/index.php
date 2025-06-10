<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Studentsy</title>
    <link rel="icon" type="image/x-icon" href="/pvi/assets/img/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/pvi/assets/css/students.css" />
    <link rel="stylesheet" href="/pvi/assets/css/modal-window.css" />
</head>

<body>
    <header>
        <div class="header-left">
            <span>
                <i class="fa-solid fa-frog" style="color: #b44b28;font-size: 24px;"></i>
            </span>
            <a href="/pvi/students" class="logo">Studentsy</a>
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
        <aside class="big-sidebar">
            <nav>
                <ul>
                    <li class="hideOnMobile"><a href="/pvi/dashbord" class="nav-link">Dashboard</a></li>
                    <li class="hideOnMobile active-nav"><a href="/pvi/students/index" class="nav-link">Students</a></li>
                    <li class="hideOnMobile"><a href="/pvi/messages" class="nav-link">Messages</a></li>
                </ul>
            </nav>
        </aside>
        <aside class="small-sidebar">
            <nav>
                <ul>
                    <li><a href="/pvi/dashbord" class="nav-link">Dashboard</a></li>
                    <li class="active-nav"><a href="/pvi/students/index" class="nav-link">Students</a></li>
                    <li><a href="/pvi/messages" class="nav-link">Messages</a></li>
                    <li id="close-sidebar" class="close-sidebar" onclick=hideSidebar()><i class="fa-solid fa-xmark sidebar-button" style="color: #3a5635;"></i></li>
                </ul>
            </nav>
        </aside>
        <span class="open-sidebar" onclick=showSidebar()><i class="fa-solid fa-bars" style="color: #f4e2d0;"></i></span>

        <div class="content">
            <div class="title-container">
                <h1>Students</h1>

                <button id="plus-button" class="plus-button" aria-label="button to add new student">
                    <i class="fa-solid fa-plus"></i>
                </button>

                <div id="add-student-modal" class="modal add-modal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h1 class="modal-window-header">Add new student</h1>

                        <div class="input-group">
                            <p>Group</p>
                            <select id="group-select">
                                <option disabled="disabled" selected="selected">Select group</option>
                                <option id="PZ-21">PZ-21</option>
                                <option id="PZ-22">PZ-22</option>
                                <option id="PZ-23">PZ-23</option>
                                <option id="PZ-24">PZ-24</option>
                                <option id="PZ-25">PZ-25</option>
                                <option id="PZ-26">PZ-26</option>
                                <option id="PZ-27">PZ-27</option>
                            </select>
                        </div>

                        <div class="input-group">
                            <p>First name</p>
                            <input type="text" id="first-name-input" aria-label="first name input">
                        </div>

                        <div class="input-group">
                            <p>Last name</p>
                            <input type="text" id="last-name-input" aria-label="last name input">
                        </div>

                        <div class="input-group">
                            <p>Gender</p>
                            <select id="gender-select" required>
                                <option disabled="disabled" selected="selected">Select gender</option>
                                <option id="male">Male</option>
                                <option id="female">Female</option>
                            </select>
                        </div>

                        <div class="input-group">
                            <p>Birthday</p>
                            <input type="date" id="birthday-input" aria-label="birthday input" min="1955-01-01" max="2009-10-31">
                        </div>

                        <div id="error-messages" style="color: red; margin-top: 10px;"></div>

                        <button class="cancel-button">Cancel</button>
                        <button class="create-button">Create</button>
                    </div>
                </div>

            </div>

            <div>
                <div class="table-wrapper">
                    <table class="studentsy">
                        <thead>
                            <tr>
                                <th aria-label="select all students"><input type="checkbox" id="main-check" aria-label="checkbox to select all students"></th>
                                <th class="group">Group</th>
                                <th class="name">Name</th>
                                <th class="gender">Gender</th>
                                <th class="birthday">Birthday</th>
                                <th class="status">Status</th>
                                <th class="options">Options</th>
                                <th class="id">id</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>

                <div class="students-nav">
                    <button>&lt;-</button>
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>-&gt;</button>
                </div>
            </div>

        </div>
    </main>

    <div id="remove-student-modal" class="remove-modal">
        <div class="modal-content">
            <span class="close" id="remove-close">&times;</span>
            <h1 class="modal-window-header">Warning</h1>

            <p>Are you sure you want to delete user </p>
            <button class="cancel-button" id="remove-cancel">Cancel</button>
            <button class="ok-button">Ok</button>
        </div>
    </div>

    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script src="/pvi/assets/js/clientSocket.js"></script>
    <script src="/pvi/assets/js/notifications.js"></script>
    <script src="/pvi/assets/js/students.js"></script>
    <script>
        window.addEventListener('DOMContentLoaded', function() {
            const name = sessionStorage.getItem('first_name');
            const surname = sessionStorage.getItem('last_name');

            console.log("Retrieved from session:", name, surname);

            if (name && surname) {
                const userNameElement = document.querySelector('.user-name');

                if (userNameElement) {
                    userNameElement.textContent = `${name} ${surname}`;
                    console.log("Updated existing element");
                } else {
                    const profileArea = document.createElement('div');
                    profileArea.innerHTML = `<b>${surname} ${name}</b>`;
                    profileArea.style.position = "absolute";
                    profileArea.style.top = "10px";
                    profileArea.style.right = "10px";
                    profileArea.style.color = "#3a5635";
                    profileArea.style.zIndex = "1000";
                    profileArea.style.backgroundColor = "rgba(244, 226, 208, 0.8)";
                    profileArea.style.padding = "5px 10px";
                    profileArea.style.borderRadius = "5px";

                    document.body.appendChild(profileArea);
                    console.log("Created new element");
                }
            } else {
                console.log("No user data found in session");
            }
        });
    </script>

</body>

</html>