var req;
var likeform = $(".like-form");
var debounceTimeout = null;

var likeEvents = function (d) {
  if (req) {
    req.abort();
  }
  const datastring = $(d).attr("id");
  // console.log(datastring);
  // var likescount = parseInt($("." + datastring.substring(7, 31)).html());
  if ($("#like-" + datastring.substring(7, 31)).hasClass("far")) {
    // console.log("far");
    $("#like-" + datastring.substring(7, 31)).removeClass("far");
    $("#like-" + datastring.substring(7, 31)).addClass("fas");
    const nurl = datastring + "like";
    // console.log(nurl);
    req = $.ajax({
      type: "POST",
      url: nurl,
      dataType: "json",
    });
    req.done(function (data, textStatus, jqXHR) {
      console.log("liked");
      $("." + datastring.substring(7, 31)).html(data.toString());
      req = null;
    });
    req.fail(function (jqXHR, textStatus, errorThrown) {
      console.log("error: " + errorThrown, textStatus);
    });
    req.always(function (jqXHROrData, textStatus, jqXHROrErrorThrown) {
      console.log(textStatus + " complete");
    });
  } else {
    // console.log("fas");
    $("#like-" + datastring.substring(7, 31)).removeClass("fas");
    $("#like-" + datastring.substring(7, 31)).addClass("far");
    const nurl = datastring + "dislike";
    // console.log(nurl);
    req = $.ajax({
      type: "POST",
      url: nurl,
      dataType: "json",
    });
    req.done(function (data, textStatus, jqXHR) {
      console.log("disliked");
      $("." + datastring.substring(7, 31)).html(data.toString());
      req = null;
    });
    req.fail(function (jqXHR, textStatus, errorThrown) {
      console.log("error: " + errorThrown, textStatus);
    });
    req.always(function (jqXHROrData, textStatus, jqXHROrErrorThrown) {
      console.log(textStatus + " complete");
    });
  }
};

likeform.on("submit", function (event) {
  clearTimeout(debounceTimeout);
  var x = this;
  // debounceTimeout = setTimeout(likeEvents(this), 6000);
  debounceTimeout = setTimeout(likeEvents, 300, x);
  event.preventDefault();
});

// $(".like-form").on("submit", function (e) {
//   // alert("form-submitted");
//   const datastring = $(this).attr("id");
//   // alert(datastring.substring(7, 31));
//   var likescount = parseInt($("." + datastring.substring(7, 31)).html());
//   // alert(likescount);
//   // alert("liked");
//   $.ajax({
//     type: "POST",
//     url: datastring,
//     dataType: "json",
//     success: function (data) {
//       if (data.message === "liked successfully") {
//         $("#like-" + datastring.substring(7, 31)).removeClass("far");
//         $("#like-" + datastring.substring(7, 31)).addClass("fas");

//         $("." + datastring.substring(7, 31)).html((likescount + 1).toString());
//         // alert(data.message);
//       } else {
//         $("#like-" + datastring.substring(7, 31)).removeClass("fas");
//         $("#like-" + datastring.substring(7, 31)).addClass("far");

//         $("." + datastring.substring(7, 31)).html((likescount - 1).toString());
//         // alert(data.message);
//       }
//     },
//     error: function (error) {
//       alert(JSON.parse(error));
//     },
//   });
//   e.preventDefault();
// });
