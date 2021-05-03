//new modal
const modal = document.querySelector("#new-modal");
const btn = document.querySelector("#btn-modal");

//search modal
const smodal = document.querySelector("#search-modal");
const sbtn = document.querySelector("#btn-modal-search");

btn.addEventListener("click", function () {
  smodal.style.display = "none";
  modal.style.display = "block";
});

window.addEventListener("click", function (event) {
  if (event.target.className === "modal-background") {
    modal.style.display = "none";
  }
});

sbtn.addEventListener("click", function () {
  modal.style.display = "none";
  smodal.style.display = "block";
});

window.addEventListener("click", function (event) {
  if (event.target.className === "modal-background") {
    smodal.style.display = "none";
  }
});
