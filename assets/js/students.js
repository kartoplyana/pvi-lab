document.addEventListener('DOMContentLoaded', () => {
    function openEditStudentModal(e) {
        document.getElementById("add-student-modal").style.display="block";
        document.querySelector(".modal-window-header").innerText = "Edit student";

        document.getElementById("add-student-modal").style.display="block";
        document.querySelector(".modal-window-header").innerText = "Edit student";
        document.querySelector(".create-button").innerText = "Save";

        document.querySelector("#group-select").style.border = "0.5px solid grey";
        document.querySelector("#first-name-input").style.border = "0.5px solid grey";
        document.querySelector("#last-name-input").style.border = "0.5px solid grey";
        document.querySelector("#gender-select").style.border = "0.5px solid grey";
        document.querySelector("#birthday-input").style.border = "0.5px solid grey";

        e.preventDefault();

        currentStudRow = e.target.closest("tr");
        let cells = currentStudRow.querySelectorAll("td");

        let currentGroup = cells[1].innerText;
        let currentStudName = cells[2].innerText;
        let currentFirstName = currentStudName.split(" ")[0];
        let currentLastName = currentStudName.split(" ")[1];
        let currentGender = cells[3].innerText;
        let currentBirthday = cells[4].innerText.split(".").reverse().join("-");

        document.querySelector("#group-select").value = currentGroup;
        document.querySelector("#first-name-input").value = currentFirstName;
        document.querySelector("#last-name-input").value = currentLastName;
        if(currentGender == "F") {
            document.querySelector("#gender-select").value = "Female";
        }
        else if(currentGender == "M") {
            document.querySelector("#gender-select").value = "Male";
        }
        document.querySelector("#birthday-input").value = currentBirthday;

        document.getElementById("error-messages").innerHTML = "";
    }

    
    let currentPage = 1;
    const perPage = 4;
    const tableBody = document.querySelector('.studentsy tbody');
    const navButtons = document.querySelectorAll('.students-nav button');

    // Основна функція для завантаження студентів
    function fetchStudents(page = 1) {
        fetch(`/pvi/students/getAll?page=${page}&limit=${perPage}`)
            .then(res => res.json())
            .then(data => {
                tableBody.innerHTML = '';
                data.data.forEach(student => {
                    console.log(student);
                    const { id, group, firstName, lastName, gender, birthday, isOnline } = student;
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><input type="checkbox" aria-label="${id} student check"/></td>
                        <td>${group}</td>
                        <td>${firstName} ${lastName}</td>
                        <td>${gender}</td>
                        <td>${birthday.split("-").reverse().join(".")}</td>
                        <td>
                            <div class="${isOnline === 1 ? 'status-active' : 'status-unactive'}"></div>
                        </td>
                        <td>
                            <button class="edit-button" aria-label="edit button">
                                <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button class="remove-button" aria-label="remove button">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </td>
                        <td class="id">${id}</td>
                    `;

                    console.log(lastName);
                    console.log(isOnline);
                    row.querySelector(".edit-button").addEventListener("click", openEditStudentModal);
                    row.querySelector(".remove-button").addEventListener("click", openStudentModal);
                    row.querySelector("input[type='checkbox']").addEventListener("click", selectStudent);

                    tableBody.appendChild(row);
                });

                currentPage = data.meta.page;
                updateNavButtons(data.meta.totalPages);
            });
    }

    // Функція, що активує/деактивує кнопки та оновлює клас active
    function updateNavButtons(totalPages) {
        navButtons.forEach(btn => btn.classList.remove('active'));

        navButtons.forEach(btn => {
            const label = btn.textContent.trim();

            if (!isNaN(label) && +label === currentPage) {
                btn.classList.add('active');
            }

            if (label === '<-') {
                btn.disabled = currentPage <= 1;
            }

            if (label === '->') {
                btn.disabled = currentPage >= totalPages;
            }
        });
    }

    // Обробка кліків по кнопках навігації
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const label = btn.textContent.trim();

            if (label === '<-') {
                if (currentPage > 1) fetchStudents(currentPage - 1);
            } else if (label === '->') {
                fetch(`/pvi/students/getAll?page=1&limit=${perPage}`)
                    .then(res => res.json())
                    .then(data => {
                        const totalPages = data.meta.totalPages;
                        if (currentPage < totalPages) {
                            fetchStudents(currentPage + 1);
                        }
                    });
            } else if (!isNaN(label)) {
                fetchStudents(parseInt(label));
            }
        });
    });

    fetchStudents();


    let modal = document.querySelector("#add-student-modal");
    let span = document.querySelector(".close");
    let cancelButton = document.querySelector(".cancel-button");

    const addButton = document.querySelector("#plus-button");
    addButton.addEventListener("click", () => {
        modal.style.display = "block";

        document.querySelector(".modal-window-header").innerText = "Add new student";
        document.querySelector(".create-button").innerText = "Create";
        clearInputs();

        document.querySelector("#group-select").style.border = "0.5px solid grey";
        document.querySelector("#first-name-input").style.border = "0.5px solid grey";
        document.querySelector("#last-name-input").style.border = "0.5px solid grey";
        document.querySelector("#gender-select").style.border = "0.5px solid grey";
        document.querySelector("#birthday-input").style.border = "0.5px solid grey";

        document.getElementById("error-messages").innerHTML = "";
    })

    span.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    })

    cancelButton.addEventListener("click", function() {
        modal.style.display = "none";
        document.getElementById("error-messages").innerHTML = "";
        clearInputs();
    });

    const createButton = document.querySelector(".modal .create-button");
    const groupSelect = document.querySelector("#group-select");
    const firstNameInput = document.querySelector("#first-name-input");
    const lastNameInput = document.querySelector("#last-name-input");
    const genderSelect = document.querySelector("#gender-select");
    const birthdayInput = document.querySelector("#birthday-input");

    createButton.addEventListener("click", (e) => {
        if (e.target.innerText !== "Create")
            return;

        e.preventDefault();

        document.getElementById("error-messages").innerHTML = "";

        const group = groupSelect.value;
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        let gender;
        if(genderSelect.value === "Male") {
            gender = "M";
        }
        else if(genderSelect.value === "Female") {
            gender = "F";
        }
        else {
            gender = "";
        }
        const birthday = birthdayInput.value;

        /*if (groupSelect.selectedIndex === 0) {
            document.querySelector("#group-select").style.border = "2px solid red";
            return;
        }
        else {
            document.querySelector("#group-select").style.border = "0.5px solid grey";
        }

        let regexName = /^[A-Z][A-Za-z]+(-[A-Za-z]+)*$/;
        if (!regexName.test(firstNameInput.value)) {
            document.querySelector("#first-name-input").style.border = "2px solid red";
            return;
        }
        else {
            document.querySelector("#first-name-input").style.border = "0.5px solid grey";
        }

        if (!regexName.test(lastNameInput.value)) {
            document.querySelector("#last-name-input").style.border = "2px solid red";
            return;
        }
        else {
            document.querySelector("#last-name-input").style.border = "0.5px solid grey";
        }

        if (genderSelect.selectedIndex === 0) {
            document.querySelector("#gender-select").style.border = "2px solid red";
            return;
        }
        else {
            document.querySelector("#gender-select").style.border = "0.5px solid grey";
        }

        if (birthdayInput.value === "") {
            document.querySelector("#birthday-input").style.border = "2px solid red";
            return;
        }
        else {
            document.querySelector("#birthday-input").style.border = "0.5px solid grey";
        }*/

        let newStudent = { group:group, firstName:firstName, lastName:lastName, gender:gender, birthday:birthday };
        //console.log(JSON.stringify(newStudent));
        fetch(`/pvi/students/add`, {
            method: "POST",
            body: JSON.stringify(newStudent),
        })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    document.getElementById("error-messages").innerHTML = "";

                    console.log(data.errors);
            
                    Object.values(data.errors).forEach(error => {
                        let errorContainer = document.getElementById("error-messages");
                        let errorElement = document.createElement("p");
                        errorElement.innerText = error;
                        errorElement.style.color = "red";
                        errorContainer.appendChild(errorElement);
                    });
            
                    return;
                }

                console.log(data);
                fetchStudents();

                document.getElementById("error-messages").innerHTML = "";
                document.querySelector("#add-student-modal").style.display = "none";
                document.querySelector(".modal").style.display = "none";
                clearInputs();
            });
    });

    function clearInputs() {
        groupSelect.selectedIndex = 0;
        firstNameInput.value = "";
        lastNameInput.value = "";
        genderSelect.selectedIndex = 0;
        birthdayInput.value = "";
    }


    let currentStudRow = null;
    //const editButton = document.querySelector(".edit-button");

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    createButton.addEventListener("click", (e) => {
        if (e.target.innerText !== "Save")
            return;
        e.preventDefault();

        document.getElementById("error-messages").innerHTML = "";
        
        const newGroup = groupSelect.value;
        const newFirstName = firstNameInput.value;
        const newLastName = lastNameInput.value;
        let newGender;
        if(genderSelect.value === "Male") {
            newGender = "M";
        }
        else if(genderSelect.value === "Female") {
            newGender = "F";
        }
        else {
            newGender = "";
        }
        const newBirthday = birthdayInput.value;
        const id = currentStudRow.querySelector("td.id").innerText;

        /*if (groupSelect.selectedIndex === 0) {
            document.querySelector("#group-select").style.border = "2px solid red";
            return;
        }
        else {
        document.querySelector("#group-select").style.border = "0.5px solid grey";
        }

        let regexName = /^[A-Z][A-Za-z]+(-[A-Za-z]+)*$/;
        if (!regexName.test(firstNameInput.value)) {
            document.querySelector("#first-name-input").style.border = "2px solid red";
            return;
        }
        else {
        document.querySelector("#first-name-input").style.border = "0.5px solid grey";
        }

        if (!regexName.test(lastNameInput.value)) {
            document.querySelector("#last-name-input").style.border = "2px solid red";
            return;
        }
        else {
        document.querySelector("#last-name-input").style.border = "0.5px solid grey";
        }

        if (genderSelect.selectedIndex === 0) {
            document.querySelector("#gender-select").style.border = "2px solid red";
            return;
        }
        else {
        document.querySelector("#gender-select").style.border = "0.5px solid grey";
        }

        if (birthdayInput.value === "") {
            document.querySelector("#birthday-input").style.border = "2px solid red";
            return;
        }
        else {
        document.querySelector("#birthday-input").style.border = "0.5px solid grey";
        }*/

        let editedStudent = { id:id, group:newGroup, firstName:newFirstName, lastName:newLastName, gender:newGender, birthday:newBirthday };
        fetch(`/pvi/students/edit`, {
            method: "POST",
            body: JSON.stringify(editedStudent),
        })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    document.getElementById("error-messages").innerHTML = "";

                    console.log(data.errors);
            
                    Object.values(data.errors).forEach(error => {
                        let errorContainer = document.getElementById("error-messages");
                        let errorElement = document.createElement("p");
                        errorElement.innerText = error;
                        errorElement.style.color = "red";
                        errorContainer.appendChild(errorElement);
                    });
            
                    return;
                }

                console.log(data);
                fetchStudents();

                document.getElementById("error-messages").innerHTML = "";
                clearInputs();
                document.querySelector("#add-student-modal").style.display = "none";
                document.querySelector(".modal").style.display = "none";
            });
    });


    document.querySelector("#remove-close").addEventListener("click", cancelModalButton);
    document.querySelector("#remove-cancel").addEventListener("click", cancelModalButton);

    let studentsToDelete = [];
    const okButton = document.querySelector(".remove-modal .ok-button");
    okButton.addEventListener("click", okRemoveModalButton);
    let mainCheck = document.getElementById("main-check");

    mainCheck.addEventListener("change", (e) => {
        if (e.target.checked) {
            let studentIds = [];
            document.querySelectorAll("tbody .id").forEach(idElem => studentIds.push(idElem.innerText));
            studentsToDelete = studentIds;
        }
        else {
            studentsToDelete = [];
        }
    })

    let logOutButton = document.querySelector("#log-out");
    logOutButton.addEventListener("click", async (e) => {
        e.preventDefault(); // Щоб не перезавантажувалась сторінка (якщо кнопка в формі)

        try {
            const response = await fetch('/pvi/logout', {
                method: 'POST',
            });
    
            if (response.ok) {
                // Якщо сесія знищена успішно — переходимо на сторінку входу
                window.location.href = '/pvi/auth/logIn';
            } else {
                console.error('Logout failed.');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    });

    function openStudentModal(e) {
        if(studentsToDelete.length === 0){
            return;
        }
        document.getElementById("remove-student-modal").style.display="block";
        let studentNames = [];
        studentsToDelete.forEach(id => {
            document.querySelectorAll("tr").forEach(row => {
                if (row.querySelector(".id").innerText === id)
                studentNames.push(row.querySelector("td:nth-child(3)").innerText)
            })
        })
        document.querySelector("#remove-student-modal p").innerText=`Are you sure you want to delete ${studentNames.join(", ")}?`
    }

    function cancelModalButton() {
        studentsToDelete = [];
        document.getElementById("remove-student-modal").style.display="none";
    }

    function okRemoveModalButton(e) {
        document.querySelectorAll("tr").forEach(row => {
            if (studentsToDelete.includes(row.querySelector(".id").innerText)) {
                fetch(`/pvi/students/delete`, {
                    method: "DELETE",
                    body: JSON.stringify(studentsToDelete),
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        fetchStudents();
                    });
            }
        })
        cancelModalButton();
    }

    function selectStudent(e) {
        let isChecked = e.target.checked;
        let selectedRow = e.target.closest("tr");
        let id = selectedRow.querySelector(".id").innerText;

        if(isChecked) {
            studentsToDelete.push(id);
        }
        else {
            studentsToDelete = studentsToDelete.filter(item => item !== id);
        }
    }
});