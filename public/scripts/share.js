var $temp = $("<input>");
var $url = $(location).attr("href");

$(".clipboard").on("click", function () {
  const id = $(this).attr("id");
  const i = id.substr(6);
  $("#copymsg-" + i).hide();
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
  $("#copymsg-" + i).show();
  setTimeout(function () {
    $("#copymsg-" + i).hide();
  }, 3000);
});
