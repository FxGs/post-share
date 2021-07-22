var $temp = $("<input>");
var $url = $(location).attr("href");

$("body").on("click", ".clipboard", function () {
  console.log("clicked");
  const id = $(this).attr("id");
  const i = id.substr(6);
  $("body").append($temp);
  var hostname = $("<a>").prop("href", $url).prop("hostname");
  var protocol = $("<a>").prop("href", $url).prop("protocol");
  var portnumber = $("<a>").prop("href", $url).prop("port");
  var url;
  if (portnumber) {
    url = protocol + "//" + hostname + ":" + portnumber + "/posts/" + i;
    // alert();
  } else {
    url = protocol + "//" + hostname + "/posts/" + i;
    // alert(protocol + "//" + hostname + "/posts/" + id);
  }
  $temp.val(url).select();
  document.execCommand("copy");
  $temp.remove();
  $("#share-" + i).css("background-color", "#48c78e");
  $("#share-" + i).css("color", "#fff");
  setTimeout(function () {
    $("#share-" + i).css("background-color", "#fff");
    $("#share-" + i).css("color", "black");
  }, 3000);
});
