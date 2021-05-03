const fileInput = document.querySelector("#file-js-example input[type=file]");
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector("#file-js-example .file-name");
    fileName.textContent = fileInput.files[0].name;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  (document.querySelectorAll(".notification .delete") || []).forEach(
    ($delete) => {
      const $notification = $delete.parentNode;

      $delete.addEventListener("click", () => {
        $notification.parentNode.removeChild($notification);
      });
    }
  );
});

// for searching
$("#search").on("input", function (e) {
  const query = $("#search").val();
  console.log(query+"hello");
  $("#sresults").html('');
  if (query !== "") {
    const newurl = "/user/search?profile=" + query;
    // alert(newurl);
    $.ajax({
      type: "GET",
      url: newurl,
      dataType: "json",
      success: function (data) {
        $("#sresults").html('');
        console.log(data.length);
        for (var i = 0; i < data.length; i++) {
          // console.log(data[i].item.username);
          $("#sresults").append(
            '<li><div class="card mb-1" style="box-shadow: none;"><header class="card-header"><div class="card-header-title"><figure class="image is-48x48 mr-2"><img class="is-rounded" src="' +
              data[i].item.profile.avatar.url +
              '" alt="" /></figure><div><p class="title">' +
              data[i].item.username +
              '</p><p class="subtitle">' +
              data[i].item.profile.name +
              '</p></div></div></header></div></li>'
          );
        }
      },
      error: function (error) {
        alert(JSON.parse(error));
      },
    });
  }
  else{
    alert("somen aniki");
    console.log($("#sresults").html());
    $("#sresults").empty();
    console.log($("#sresults").html());
  }
  e.preventDefault();
});