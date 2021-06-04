var socket = io();
socket.on("connection");

var req;
var likeform = $(".like-form");
var debounceTimeout = null;
var success = false;

var likeEvents = function (d) {
  if (req) {
    req.abort();
  }
  const datastring = $(d).attr("id");
  // console.log(datastring);
  var likescount = parseInt($("." + datastring.substring(7, 31)).html());
  if ($("#like-" + datastring.substring(7, 31)).hasClass("far")) {
    // console.log("far");
    $("#like-" + datastring.substring(7, 31)).removeClass("far");
    $("#like-" + datastring.substring(7, 31)).addClass("fas");
    $("." + datastring.substring(7, 31)).html((likescount + 1).toString());
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
      const ele = datastring.substring(7, 31);
      var info = { pid: ele, count: data };
      socket.emit("likes count", info);
      req = null;

      // console.log(ele);
      success = true;
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
    $("." + datastring.substring(7, 31)).html((likescount - 1).toString());
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
      const ele = datastring.substring(7, 31);
      var info = { pid: ele, count: data };
      socket.emit("likes count", info);
      req = null;
      // console.log(ele);
      success = true;
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
  debounceTimeout = setTimeout(likeEvents, 500, x);
  event.preventDefault();
});

socket.on("likes count", function (msg) {
  $("." + msg.pid).html(msg.count.toString());
});
