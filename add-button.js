let modal = document.getElementById("add-student-modal");
let btn = document.getElementById("plus-button");
let span = document.getElementsByClassName("close")[0];
let cancelButton = document.querySelector(".cancel-button");

const addButton = document.querySelector("#plus-button");
addButton.addEventListener("click", () => {
  document.querySelector(".modal-window-header").innerText = "Add new student";
  document.querySelector(".create-button").innerText = "Create";
  clearInputs();
  document.querySelector("#group-select").style.border = "0.5px solid grey";
  document.querySelector("#first-name-input").style.border = "0.5px solid grey";
  document.querySelector("#last-name-input").style.border = "0.5px solid grey";
  document.querySelector("#gender-select").style.border = "0.5px solid grey";
  document.querySelector("#birthday-input").style.border = "0.5px solid grey";
})

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

cancelButton.addEventListener("click", function() {
  modal.style.display = "none";
  clearInputs();
});

let listOfStudents = document.querySelector('.studentsy tbody');
let newStudendId = listOfStudents.children.length + 1;
const createButton = document.querySelector(".modal .create-button");
const groupSelect = document.querySelector("#group-select");
const firstNameInput = document.querySelector("#first-name-input");
const lastNameInput = document.querySelector("#last-name-input");
const genderSelect = document.querySelector("#gender-select");
const birthdayInput = document.querySelector("#birthday-input");

function addRow(group, firstName, lastName, gender, birthday) {

  const newRow = `
        <tr>
            <td><input type="checkbox" aria-label="${newStudendId} student check" onchange="selectStudent(event)"/></td>            
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
            <td class="id">${newStudendId}</td>  
        </tr>
        `;

    listOfStudents.innerHTML += newRow;
    newStudendId++;
}

createButton.addEventListener("click", (e) => {
  if (e.target.innerText !== "Create")
    return;

  e.preventDefault();

  const group = groupSelect.value;
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  //const gender = genderSelect.value;
  if(genderSelect.value === "Male"){
    gender = "M";
  }
  else{
    gender = "F";
  }
  const birthday = birthdayInput.value;

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


  addRow(group, firstName, lastName, gender, birthday);

  let newStudent = {  id:newStudendId, group:group, firstName:firstName, lastName:lastName, gender:gender, birthday:birthday };
  console.log(JSON.stringify(newStudent));

  document.querySelector("#add-student-modal").style.display = "none";
  document.querySelector(".modal").style.display = "none";
  clearInputs();
});

function clearInputs() {
  groupSelect.selectedIndex = 0;
  firstNameInput.value = "";
  lastNameInput.value = "";
  genderSelect.selectedIndex = 0;
  birthdayInput.value = "";
}