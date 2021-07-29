// Register the plugin
FilePond.registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageTransform,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageEdit,
  FilePondPluginImageResize,
  FilePondPluginImageCrop
);

var cropper;
const pre = $("#avatar-preview");

const editor = {
  // Called by FilePond to edit the image
  // - should open your image editor
  // - receives file object and image edit instructions
  open: (file, instructions) => {
    $("#crop-modal").addClass("is-active");
    $("#cropbox").show();
    $("#initial-preview").hide();
    $("#avatar-preview").show();
    // // open editor here
    // console.log(instructions);
    const url = URL.createObjectURL(file);
    const img = document.getElementById("edit");
    img.src = url;
    if (img.classList.contains("cropper-hidden")) {
      cropper.destroy();
      cropper = null;
    }
    cropper = new Cropper(img, {
      aspectRatio: 1,
      viewmode: 0,
      background: false,
      dragMode: "move",
      cropBoxResizable: false,
      cropBoxMovable: false,
      minCanvasWidth: 100,
      minCanvasHeight: 100,
      minCropBoxWidth: 200,
      minCropBoxHeight: 200,
      preview: "#avatar-preview",
    });
  },

  // Callback set by FilePond
  // - should be called by the editor when user confirms editing
  // - should receive output object, resulting edit information
  onconfirm: (output) => {
    // console.log(output);
    $("#crop-modal").removeClass("is-active");
    $("#cropbox").hide();
  },

  // Callback set by FilePond
  // - should be called by the editor when user cancels editing
  oncancel: () => {
    console.log("canceled");
    $("#crop-modal").removeClass("is-active");
    $("#cropbox").hide();
  },

  // Callback set by FilePond
  // - should be called by the editor when user closes the editor
  onclose: () => {
    console.log("closed");
  },
};

$(document).ready(function () {
  setTimeout(function () {
    $("#edit-container").show();
  }, 500);

  // Turn input element into a pond with configuration options
  $(".my-pond").filepond({
    allowMultiple: false,
    maxFileSize: "2mb",
    imageResizeMode: "cover",
    imagePreviewMinHeight: 130,
    imagePreviewMaxHeight: 130,
    imageCropAspectRatio: "1:1",
    imageResizeTargetWidth: 200,
    imageResizeTargetHeight: 200,
    imageTransformOutputMimeType: "image/png",
    imageEditEditor: editor,
  });
});

$("#crop").on("click", function () {
  const canvasdata = cropper.getCanvasData();
  const cropdata = cropper.getData();
  // console.log(canvasdata, cropdata);

  const cropAreaRatio = cropdata.height / cropdata.width;

  /* Center point of crop area in percent. */
  const percentX = (cropdata.x + cropdata.width / 2) / canvasdata.naturalWidth;
  const percentY =
    (cropdata.y + cropdata.height / 2) / canvasdata.naturalHeight;

  /* Calculate available space round image center position. */
  const cx = percentX > 0.5 ? 1 - percentX : percentX;
  const cy = percentY > 0.5 ? 1 - percentY : percentY;

  /* Calculate image rectangle respecting space round image from crop area. */
  let width = canvasdata.naturalWidth;
  let height = width * cropAreaRatio;
  if (height > canvasdata.naturalHeight) {
    height = canvasdata.naturalHeight;
    width = height / cropAreaRatio;
  }
  const rectWidth = cx * 2 * width;
  const rectHeight = cy * 2 * height;

  /* Calculate zoom. */
  const zoom = Math.max(
    rectWidth / cropdata.width,
    rectHeight / cropdata.height
  );

  editor.onconfirm({
    data: {
      crop: {
        center: {
          x: percentX,
          y: percentY,
        },
        flip: {
          horizontal: cropdata.scaleX < 0,
          vertical: cropdata.scaleY < 0,
        },
        zoom: zoom,
        rotation: 0,
        aspectRatio: cropAreaRatio,
      },
      size: {
        height: 200,
        width: 200,
        mode: "cover",
        upscale: true,
      },
    },
  });
  // console.log(cropper);
});

$("#cancel").on("click", function () {
  editor.oncancel();
});

$("#reset").on("click", function () {
  cropper.reset();
});

$(".edit-profile-form").on("submit", function (e) {
  console.log("submitted");
  $("#edit-profile-submit-button").attr("disabled", true);
  $("#cancel-profile-save").attr("disabled", true);
  var id = $(this).attr("id");
  var form = $(this);
  var formdata = form.serialize();
  // console.log(formdata);
  var url = "/user/profile/" + id;
  // console.log(url);
  $.ajax({
    type: "POST",
    url: url,
    data: formdata,
    success: function (data) {
      // window.location.href = "/user/profile";
      $("#profile-save").show();
      setTimeout(function () {
        $("#profile-save").hide();
        $("#edit-profile-submit-button").removeAttr("disabled");
        $("#cancel-profile-save").removeAttr("disabled");
      }, 1500);
    },
    error: function (error) {
      var err = JSON.stringify(error);
      console.log(err);
      alert(JSON.parse(err));
    },
  });
  e.preventDefault();
});
