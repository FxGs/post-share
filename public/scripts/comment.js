$(document).ready(function () {
  $("input.cmnt1").change(function (e) {
    // alert("changed");
    $("#Btn1").attr("disabled", false);
    e.preventDefault();
  });

  $(".cmnt1").emojioneArea({
    events: {
      ready: function () {
        this.setFocus();
      },
    },
    pickerPosition: "top",
    filtersPosition: "bottom",
    spellcheck: true,
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
      $("#post-" + id.substring(8, 32)).attr("disabled", false);

      e.preventDefault();
    });
    $("#" + id).emojioneArea({
      events: {
        ready: function () {
          this.setFocus();
        },
      },
      pickerPosition: "top",
      filtersPosition: "bottom",
      spellcheck: true,
    });
  }
});
