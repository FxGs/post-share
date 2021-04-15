$(document).ready(function () {
    var bodyValidated = true;
    var titleValidated = true;
    
    $(".edit-area").change(function () {
      // var area = jQuery.trim($(".edit-area").val());
      // console.log(area.length);
      if (jQuery.trim($(".edit-area").val()) === "") {
        $(".edit-area").removeClass("is-success");
        $(".edit-area").addClass("is-danger");
        $("#editbody_error").css("display", "block");
        bodyValidated = false;
      } else {
        $(".edit-area").removeClass("is-danger");
        $(".edit-area").addClass("is-success");
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
    function checkSubmit() {
      if (titleValidated && bodyValidated) {
        $("#Edit-Btn").attr("disabled", false);
        // $("#Edit-Btn").removeAttr("disabled");
      } else {
        $("#Edit-Btn").attr("disabled", true);
      }
    }
  });