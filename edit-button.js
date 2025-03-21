modal = document.getElementById("add-student-modal");
span = document.getElementsByClassName("close")[0];
let currentStudRow = null;
const editButton = document.querySelector(".edit-button");

editButton.addEventListener("click", () => {
  document.querySelector(".modal-window-header").innerText = "Edit student";
})

function openEditStudentModal(e) {
  document.getElementById("add-student-modal").style.display="block";
  currentStudRow = e.target.closest("tr");
  document.querySelector(".modal-window-header").innerText = "Edit student";

}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// document.addEventListener("DOMContentLoaded", function () {
//   let modal = document.getElementById("edit-student-modal");
//   let btn = document.querySelector(".edit-button");
//   let closeBtn = modal.querySelector(".close");

//   btn.onclick = function () {
//       modal.style.display = "block";
//   };

//   closeBtn.onclick = function () {
//       modal.style.display = "none";
//   };

//   window.onclick = function (event) {
//     if (event.target === modal) {
//         modal.style.display = "none";
//     }
//   };
// });