$(".like-form").on("submit", function (e) {
  // alert("form-submitted");
  const datastring = $(this).attr("id");
  // alert(datastring.substring(7, 31));
  var likescount = parseInt($("." + datastring.substring(7, 31)).html());
  // alert(likescount);
  // alert("liked");
  $.ajax({
    type: "POST",
    url: datastring,
    dataType: "json",
    success: function (data) {
      if (data.message === "liked successfully") {
        $("#like-" + datastring.substring(7, 31)).removeClass("far");
        $("#like-" + datastring.substring(7, 31)).addClass("fas");

        $("." + datastring.substring(7, 31)).html((likescount + 1).toString());
        // alert(data.message);
      } else {
        $("#like-" + datastring.substring(7, 31)).removeClass("fas");
        $("#like-" + datastring.substring(7, 31)).addClass("far");

        $("." + datastring.substring(7, 31)).html((likescount - 1).toString());
        // alert(data.message);
      }
    },
    error: function (error) {
      alert("error");
    },
  });
  e.preventDefault();
});
