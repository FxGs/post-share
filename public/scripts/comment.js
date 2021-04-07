$(document).ready(function () {
  $.each($(".comment.parent"), function (i, val) {
    // console.log($(this).attr('id'));
    const childid = "child-" + $(this).attr("id");
    const loadid = "load-" + $(this).attr("id");
    console.log(childid);
    $("#" + loadid).click(function () {
      if ($("#" + childid).css("display") === "none") {
        $("#" + childid).css("display", "block");
      } else {
        $("#" + childid).css("display", "none");
      }
    });
    // $.each($("#" + childid)),
    //   function (i) {
    //     i++;
    //   };
    // console.log(i);
  });
  // alert(jQuery.type(pid));
});
