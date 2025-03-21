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
          row.remove();
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