const editmodal = document.querySelector("#editmodal");
const btn_edit = document.querySelector("#btn-edit-modal");
const close = document.querySelector(".delete");

btn_edit.addEventListener("click", function () {
  editmodal.style.display = "block";
});

close.addEventListener("click", function () {
  editmodal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target.className === "modal-background") {
    editmodal.style.display = "none";
  }
});
