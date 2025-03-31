modal = document.getElementById("add-student-modal");
span = document.getElementsByClassName("close")[0];
let currentStudRow = null;
const editButton = document.querySelector(".edit-button");

/*editButton.addEventListener("click", (e) => {
  document.getElementById("add-student-modal").style.display="block";
  document.querySelector(".modal-window-header").innerText = "Edit student";
  document.querySelector(".create-button").innerText = "Save";
  /*let saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  document.body.appendChild(saveButton);/
  e.preventDefault();

  currentStudRow = e.target.closest("tr");
  let cells = currentStudRow.querySelectorAll("td")/*currentStudRow.children/;

  let currentGroup = cells[1].innerText;
  let currentStudName = cells[2].innerText;
  let currentFirstName = currentStudName.split(" ")[0];
  let currentLastName = currentStudName.split(" ")[1];
  let currentGender = cells[3].innerText;
  let currentBirthday = cells[4].innerText.split(".").reverse().join("-");

  console.log(currentStudRow);
  console.log(cells);
  console.log(currentGroup, currentFirstName, currentLastName, currentGender, currentBirthday);

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
})*/

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
    let cells = currentStudRow.querySelectorAll("td")/*currentStudRow.children*/;

    let currentGroup = cells[1].innerText;
    let currentStudName = cells[2].innerText;
    let currentFirstName = currentStudName.split(" ")[0];
    let currentLastName = currentStudName.split(" ")[1];
    let currentGender = cells[3].innerText;
    let currentBirthday = cells[4].innerText.split(".").reverse().join("-");

    /*console.log(currentStudRow);
    console.log(cells);
    console.log(currentGroup, currentFirstName, currentLastName, currentGender, currentBirthday);*/

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
}

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

    const newGroup = groupSelect.value;
    const newFirstName = firstNameInput.value;
    const newLastName = lastNameInput.value;
    //const gender = genderSelect.value;
    if(genderSelect.value === "Male"){
        newGender = "M";
    }
    else{
        newGender = "F";
    }
    const newBirthday = birthdayInput.value;
    const id = currentStudRow.querySelector("td.id").innerText;
    //console.log(id);

    if (groupSelect.selectedIndex === 0) {
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
    }

    editRow(currentStudRow, newGroup, newFirstName, newLastName, newGender, newBirthday, id);

    let editedStudent = {  id:id, group:newGroup, firstName:newFirstName, lastName:newLastName, gender:newGender, birthday:newBirthday };
    console.log(JSON.stringify(editedStudent));

    clearInputs();
    document.querySelector("#add-student-modal").style.display = "none";
    document.querySelector(".modal").style.display = "none";
});

function editRow(currentStudRow, group, firstName, lastName, gender, birthday, id) {
    currentStudRow.innerHTML = `
    <tr>
        <td><input type="checkbox" aria-label="${id} student check" onchange="selectStudent(event)"/></td>            
        <td>${group}</td>
        <td>${firstName} ${lastName}</td>
        <td>${gender}</td>
        <td>${birthday.split("-").reverse().join(".")}</td>
        <td><div class="${(firstName === 'Polina' && lastName === 'Bakhmetieva') ? 'status-active' : 'status-unactive'}"</div></td>   
        <td>
        <button class="edit-button" onclick="openEditStudentModal(event)" aria-label="edit button"> 
            <i class="fa-solid fa-pencil"></i>
        </button>

        <button class="remove-button" onclick="openStudentModal(event)"  aria-label="remove button">
            <i class="fa-solid fa-xmark"></i>
        </button>

        </td>
        <td class="id">${id}</td>  
    </tr>
    `;
}