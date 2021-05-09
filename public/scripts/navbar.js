// const fileInput = document.querySelector("#file-js-example input[type=file]");
// fileInput.onchange = () => {
//   if (fileInput.files.length > 0) {
//     const fileName = document.querySelector("#file-js-example .file-name");
//     fileName.textContent = fileInput.files[0].name;
//   }
// };

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

var req;
var searchInput = $("#search");
var debounceTimeout = null;

var searchEvents = function () {
  if (req) {
    req.abort();
  }
  const query = $("#search").val();
  $("#sresults").empty();
  if (query !== "") {
    const newurl = "/user/search?profile=" + query;
    // console.log(query);
    req = $.ajax({
      url: newurl,
      type: "GET",
      dataType: "json",
      timeout: 4000,
    });
    req.done(function (data, textStatus, jqXHR) {
      // console.log(data);
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          // console.log(data[i].item.username);
          $("#sresults").append(
            '<a class="panel-block" href="/user/profile/' +
              data[i].item.username +
              '"><div class="card mb-1" style="box-shadow: none;"><header class="card-header"><div class="card-header-title"><figure class="image is-48x48 mr-2"><img class="is-rounded" src="' +
              data[i].item.profile.avatar.url +
              '" alt="" /></figure><div><p class="title">' +
              data[i].item.username +
              '</p><p class="subtitle">' +
              data[i].item.profile.name +
              "</p></div></div></header></div></a>"
          );
        }
      } else {
        $("#sresults").append(
          '<div class="panel-block has-text-centered" style="display: flex; justify-content: center; flex-direction: column; padding: 0;"><p>kichi pailini sala ☹️</p><img src="/assets/notfound.png" alt="" style="width: 40%; height: 40%"/></div>'
        );
      }
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

searchInput.on("input", function (event) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(searchEvents, 500);
});

$("#clearsearch").click(function () {
  $("#search").val("");
  $("#sresults").empty();
});
