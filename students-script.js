document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        const bellIcon = document.querySelector(".fa-bell");
        const notificationBadge = document.querySelector(".notification-badge");
        
        if (bellIcon) {
            bellIcon.classList.add("fa-shake");

            setTimeout(() => {
                bellIcon.classList.remove("fa-shake");
                if(notificationBadge) {
                    notificationBadge.style.display = "inline-block";
                }
            }, 3000);
        }
    }
});

function showSidebar() {
    const sidebar = document.querySelector(".small-sidebar");
    sidebar.style.display = "flex";
    const closeSidebar = document.querySelector("#close-sidebar");
    closeSidebar.style.display = "flex";
    if(sidebar.style.display === "flex") {
        document.querySelector(".open-sidebar").style.display = "none";
    }

    if(window.innerWidth > 970) {
        closeSidebar.style.display = "none";
        sidebar.style.display = "none";
    }
    else {
        closeSidebar.style.display = "flex";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".small-sidebar");
    const openBtn = document.querySelector(".open-sidebar");
    const closeBtn = document.querySelector("#close-sidebar");

    // Відкриття sidebar
    openBtn.addEventListener("click", function () {
        sidebar.classList.add("open");
    });

    // Закриття sidebar
    closeBtn.addEventListener("click", function () {
        sidebar.classList.remove("open");
    });
});

function hideSidebar(){
    const sidebar = document.querySelector(".small-sidebar");
    sidebar.style.display = "none";
    if(window.innerWidth < 970) {
        document.querySelector(".open-sidebar").style.display = "block";
    }
    else {
        document.querySelector(".open-sidebar").style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectAllCheckbox = document.getElementById("main-check");

    selectAllCheckbox.addEventListener("change", function () {
        document.querySelectorAll('tbody input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });

    });
});

document.querySelector("#main-check").addEventListener("change", e => {
    if(e.target.checked) {
        listOfStudents.querySelectorAll(".edit-button").forEach(editButton => {
            editButton.classList.add("button-disabled");
            editButton.disabled = true;
        })
    }
})

