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
var edited = false;

const editor = {
  // Called by FilePond to edit the image
  // - should open your image editor
  // - receives file object and image edit instructions
  open: (file, instructions) => {
    $("#crop-modal").addClass("is-active");
    $("#cropbox").show();
    // open editor here
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
      minCanvasWidth: 200,
      minCanvasHeight: 200,
      minCropBoxWidth: 500,
      minCropBoxHeight: 500,
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
    $("#form-container").show();
  }, 500);

  // Turn input element into a pond with configuration options
  $(".my-pond").filepond({
    allowMultiple: true,
    maxFileSize: "2mb",
    maxTotalFileSize: "4mb",
    imagePreviewMinHeight: 130,
    imagePreviewMaxHeight: 130,
    imageCropAspectRatio: "1:1",
    imageResizeTargetWidth: 500,
    imageResizeTargetHeight: 500,
    imageResizeMode: "cover",
    imageTransformOutputMimeType: "image/png",
    imageEditEditor: editor,
  });

  // Listen for addfile event
  $(".my-pond").on("FilePond:addfile", function (e) {
    console.log("new file added");
    $("#image-option").show();
  });
});

$("#crop").on("click", function () {
  $("#image-option").hide();
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
        height: 500,
        width: 500,
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

$(document)
  .ajaxStart(function () {
    console.log("started");
    $("#upload-success").show();
    $("#btn-html").empty();
    $("#upload-gif").show();
  })
  .ajaxStop(function () {
    console.log("ended");
    $("#upload-success").hide();
    $("#upload-gif").hide();
    $("#btn-html").html("Post");
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
      window.location.href = "/posts/" + data;
      // console.log(data);
    },
    error: function (error) {
      var err = JSON.stringify(error);
      alert(JSON.parse(err));
    },
  });
  e.preventDefault();
});
