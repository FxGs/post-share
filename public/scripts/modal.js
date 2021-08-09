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

$(".dropdown-btn").on("click", function (e) {
  e.stopPropagation();
  const id = $(this).attr("id").substr(9);
  if ($("#menu-" + id).hasClass("is-active")) {
    $("#menu-" + id).removeClass("is-active");
  } else {
    $("#menu-" + id).addClass("is-active");
  }
  // alert(id);
});

//logout modal
const lmodal = document.querySelector("#logout-modal");
const lbtn = document.querySelector("#logout-btn");
const closelogout = document.querySelector("#close-logout");

lbtn.addEventListener("click", function () {
  lmodal.style.display = "block";
});

closelogout.addEventListener("click", function () {
  lmodal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target.className === "modal-background") {
    lmodal.style.display = "none";
  }
});
