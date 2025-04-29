<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
        <title>Studentsy</title>
        <link rel="icon" type="image/x-icon" href="/pvi/assets/img/favicon.ico">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <link rel="stylesheet" href="/pvi/assets/css/students.css"/>
        <link rel="stylesheet" href="/pvi/assets/css/modal-window.css"/>
    </head>

    <body>
        <header>
            <div class="header-left">
                <span>
                    <i class="fa-solid fa-frog" style="color: #b44b28;font-size: 24px;"></i>
                </span>
                <a href="students.html" class="logo">Studentsy</a>
            </div>
        </header>

        <main>
            <div class="content">
                <div class="title-container">
                    <div id="logIn-modal" class="modal" style="display: flex;">
                        <div class="modal-content">
                            <h1 class="modal-window-header">Log In</h1>

                            <div class="input-group">
                                <p>Email addres</p>
                                <input type="text" id="email-input" aria-label="email input">
                            </div>

                            <div class="input-group">
                                <p>Password</p>
                                <input type="password" id="password-input" aria-label="password input">
                            </div>

                            <div id="error-messages" style="color: red; margin-top: 10px;"></div>

                            <button class="logIn-button">Log In</button>
                        </div>
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

        <!-- <script src="/pvi/assets/js/students.js"></script> -->
        <script src="/pvi/assets/js/login.js"></script>
    </body>
</html>