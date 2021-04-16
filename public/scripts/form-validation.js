$(document).ready(function () {
  var bodyValidated = false;
  var titleValidated = false;
  $(".new-area").change(function () {
    if ($(".new-area").val() === "") {
      $(".new-area").removeClass("is-success");
      $(".new-area").addClass("is-danger");
      $("#body_error").css("display", "block");
      bodyValidated = false;
    } else {
      $(".new-area").removeClass("is-danger");
      $(".new-area").addClass("is-success");
      $("#body_error").css("display", "none");
      bodyValidated = true;
    }
    checkSubmit();
  });
  $("#title").change(function () {
    if ($("#title").val() === "") {
      $("#title").removeClass("is-success");
      $("#title").addClass("is-danger");
      $("#titleSuccessIcon").css("display", "none");
      $("#titleErrorIcon").css("display", "block");
      $("#title_error").css("display", "block");
      titleValidated = false;
    } else {
      $("#title").removeClass("is-danger");
      $("#title").addClass("is-success");
      $("#titleErrorIcon").css("display", "none");
      $("#titleSuccessIcon").css("display", "block");
      $("#title_error").css("display", "none");
      titleValidated = true;
    }
    checkSubmit();
  });
  function checkSubmit() {
    if (titleValidated && bodyValidated) {
      // console.log(titleValidated + " " + bodyValidated);
      $("#newpost").attr("disabled", false);
      // $("#newpost").removeAttr("disabled");
    } else {
      $("#newpost").attr("disabled", true);
    }
  }
});

