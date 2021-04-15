$(document).ready(function () {
  $("input.cmnt1").change(function (e) {
    // alert("changed");
    $("#Btn1").attr("disabled", false);
    e.preventDefault();
  });

  $("#Btn-reply").on("click", function (e) {
    // alert("clicked");
    if ($('#reply-1').css("display") === "none") {
      // alert("opened");
      $("#reply-1").css("display", "block");
      $('#Btn-reply').css("display", "none");
    } else {
      $('#reply-1').css("display", "none");
    }
    e.preventDefault();
  });
});
