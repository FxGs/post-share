//search modal
const smodal = document.querySelector("#search-modal");
const sbtn = document.querySelector("#btn-modal-search");

sbtn.addEventListener("click", function () {
  smodal.style.display = "block";
});

window.addEventListener("click", function (event) {
  if (event.target.className === "modal-background") {
    smodal.style.display = "none";
  }
});
