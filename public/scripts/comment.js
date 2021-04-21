$(document).ready(function () {
  $("input.cmnt1").change(function (e) {
    if ($("input.cmnt1").val() === "") {
      $("#Btn1").attr("disabled", true);
    } else {
      $("#Btn1").attr("disabled", false);
    }
    e.preventDefault();
  });

  const replies = $(".comment-reply");
  for (var i = 0; i < replies.length; i++) {
    // console.log(replies[i].id.substring(4, 28));
    const id = replies[i].id;
    $("#" + id).on("click", function (e) {
      // console.log(id);
      $("#reply-" + id.substring(4, 28)).css("display", "block");
      $("#" + id).css("display", "none");
      e.preventDefault();
    });
  }

  const inputs = $(".comment-post");
  for (var j = 0; j < inputs.length; j++) {
    // console.log(inputs[j].id.substring(8, 32));
    const id = inputs[j].id;
    $("#" + id).change(function (e) {
      // console.log(id);
      if ($("#" + id).val() === "") {
        $("#post-" + id.substring(8, 32)).attr("disabled", true);
      } else {
        $("#post-" + id.substring(8, 32)).attr("disabled", false);
      }

      e.preventDefault();
    });
  }
});
