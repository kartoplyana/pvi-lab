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
    <link rel="stylesheet" href="./students-style.css" />
    <link rel="stylesheet" href="./modal-window.css" />
    <link rel="manifest" href="/manifest.json">
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
                <a href="/pvi/students/messages" class="bell" aria-label="notifications">
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
                    <li class="hideOnMobile active-nav"><a href="/pvi/students/dashbord" class="nav-link">Dashboard</a></li>
                    <li class="hideOnMobile"><a href="/pvi/students/index" class="nav-link">Students</a></li>
                    <li class="hideOnMobile"><a href="/pvi/students/messages" class="nav-link">Messages</a></li>
                </ul>
            </nav>
        </aside>
        <aside class="small-sidebar">
            <nav>
                <ul>
                    <li class="active-nav"><a href="/pvi/students/dashbord" class="nav-link">Dashboard</a></li>
                    <li><a href="/pvi/students/index" class="nav-link">Students</a></li>
                    <li><a href="/pvi/students/messages" class="nav-link">Messages</a></li>
                    <li id="close-sidebar" class="close-sidebar" onclick=hideSidebar()><i class="fa-solid fa-xmark sidebar-button" style="color: #3a5635;"></i></li>
                </ul>
            </nav>
        </aside>
        <span class="open-sidebar" onclick=showSidebar()><i class="fa-solid fa-bars" style="color: #f4e2d0;"></i></span>

        <div class="content">
            <div class="title-container">


            </div>

            <div>

                <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
                <script src="/pvi/assets/js/clientSocket.js"></script>
                <script src="/pvi/assets/js/notifications.js"></script>
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
                <script src="index.js"></script>
</body>

</html>