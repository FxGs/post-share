$(document).ready(function () {
  var authorValidated = false;
  var bodyValidated = false;
  var titleValidated = false;
  $(".new-area").change(function () {
    if ($(".new-area").val() === "") {
      $(".new-area").removeClass("is-success");
      $(".new-area").addClass("is-danger");
      $("#bodySuccessIcon").css("display", "none");
      $("#bodyErrorIcon").css("display", "block");
      $("#body_error").css("display", "block");
      bodyValidated = false;
    } else {
      $(".new-area").removeClass("is-danger");
      $(".new-area").addClass("is-success");
      $("#bodyErrorIcon").css("display", "none");
      $("#bodySuccessIcon").css("display", "block");
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
  $("#author").change(function () {
    if ($("#author").val() === "") {
      $("#author").removeClass("is-success");
      $("#author").addClass("is-danger");
      $("#authorSuccessIcon").css("display", "none");
      $("#authorErrorIcon").css("display", "block");
      $("#author_error").css("display", "block");
      authorValidated = false;
    } else {
      $("#author").removeClass("is-danger");
      $("#author").addClass("is-success");
      $("#authorErrorIcon").css("display", "none");
      $("#authorSuccessIcon").css("display", "block");
      $("#author_error").css("display", "none");
      authorValidated = true;
    }
    checkSubmit();
  });
  function checkSubmit() {
    if (authorValidated && titleValidated && bodyValidated) {
      console.log(authorValidated + " " + titleValidated + " " + bodyValidated);
      $("#newpost").attr("disabled", false);
      // $("#newpost").removeAttr("disabled");
    } else {
      $("#newpost").attr("disabled", true);
    }
  }
});

