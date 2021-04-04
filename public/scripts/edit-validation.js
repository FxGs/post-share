$(document).ready(function () {
    var authorValidated = true;
    var bodyValidated = true;
    var titleValidated = true;
    
    $(".edit-area").change(function () {
      // var area = jQuery.trim($(".edit-area").val());
      // console.log(area.length);
      if (jQuery.trim($(".edit-area").val()) === "") {
        $(".edit-area").removeClass("is-success");
        $(".edit-area").addClass("is-danger");
        $("#editbodySuccessIcon").css("display", "none");
        $("#editbodyErrorIcon").css("display", "block");
        $("#editbody_error").css("display", "block");
        bodyValidated = false;
      } else {
        $(".edit-area").removeClass("is-danger");
        $(".edit-area").addClass("is-success");
        $("#editbodyErrorIcon").css("display", "none");
        $("#editbodySuccessIcon").css("display", "block");
        $("#editbody_error").css("display", "none");
        bodyValidated = true;
      }
      checkSubmit();
    });
    $(".edit-title").change(function () {
      if (jQuery.trim($(".edit-title").val()) === "") {
        $(".edit-title").removeClass("is-success");
        $(".edit-title").addClass("is-danger");
        $("#edittitleSuccessIcon").css("display", "none");
        $("#edittitleErrorIcon").css("display", "block");
        $("#edittitle_error").css("display", "block");
        titleValidated = false;
      } else {
        $(".edit-title").removeClass("is-danger");
        $(".edit-title").addClass("is-success");
        $("#edittitleErrorIcon").css("display", "none");
        $("#edittitleSuccessIcon").css("display", "block");
        $("#edittitle_error").css("display", "none");
        titleValidated = true;
      }
      checkSubmit();
    });
    $(".edit-author").change(function () {
      if (jQuery.trim($(".edit-author").val()) === "") {
        $(".edit-author").removeClass("is-success");
        $(".edit-author").addClass("is-danger");
        $("#editauthorSuccessIcon").css("display", "none");
        $("#editauthorErrorIcon").css("display", "block");
        $("#editauthor_error").css("display", "block");
        authorValidated = false;
      } else {
        $(".edit-author").removeClass("is-danger");
        $(".edit-author").addClass("is-success");
        $("#editauthorErrorIcon").css("display", "none");
        $("#editauthorSuccessIcon").css("display", "block");
        $("#editauthor_error").css("display", "none");
        authorValidated = true;
      }
      checkSubmit();
    });
    function checkSubmit() {
      if (authorValidated && titleValidated && bodyValidated) {
        $("#Edit-Btn").attr("disabled", false);
        // $("#Edit-Btn").removeAttr("disabled");
      } else {
        $("#Edit-Btn").attr("disabled", true);
      }
    }
  });