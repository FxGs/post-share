const modal = document.querySelector(".modal");
const btn = document.querySelector("#btn-modal");
// const close = document.querySelector(".delete");

btn.addEventListener("click", function () {
  modal.style.display = "block";
});

// close.addEventListener("click", function () {
//   modal.style.display = "none";
// });

window.addEventListener("click", function (event) {
  if (event.target.className === "modal-background") {
    modal.style.display = "none";
  }
});
