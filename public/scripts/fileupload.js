// Register the plugin
FilePond.registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageResize,
  FilePondPluginImageCrop,
  FilePondPluginImageTransform,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageEdit
);

// Turn input element into a pond with configuration options
$(".my-pond").filepond({
  allowMultiple: true,
  maxFileSize: "2mb",
  maxTotalFileSize: "4mb",
  imagePreviewMaxHeight: 130,
  imageCropAspectRatio: "1:1",
  imageResizeTargetWidth: 500,
  imageResizeTargetHeight: 500,
  imageResizeUpscale: false,
});

$(document)
  .ajaxStart(function () {
    console.log("started");
    $("#upload-success").show();
    $("#upload-gif").show();
  })
  .ajaxStop(function () {
    console.log("ended");
    $("#upload-success").hide();
    $("#upload-gif").hide();
  });

$("#post-form").on("submit", function (e) {
  $("#newpost").attr("disabled", "true");
  console.log("submitted");
  var form = $(this);
  var formdata = form.serialize();
  $.ajax({
    type: "POST",
    url: "/posts",
    data: formdata,
    success: function (data) {
      $("#newpost").attr("disabled", "false");
      $("#post-form *").prop("disabled", false);
      window.location.href = "/posts/" + data;
      console.log(data);
    },
    error: function (error) {
      var err = JSON.stringify(error);
      alert(JSON.parse(err));
    },
  });
  e.preventDefault();
});
