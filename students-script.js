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
        /*listOfStudents.querySelectorAll(".remove-button").forEach(removeButton => {
            removeButton.disabled = false;
        })
    }
    /*else {
        listOfStudents.querySelectorAll(".remove-button").forEach(removeButton => {
            removeButton.disabled = true;
        }) 
    }*/
})

