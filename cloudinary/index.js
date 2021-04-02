const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "fancy",
  api_key: "872123222511528",
  api_secret: "IZLsslHyIcXnwZaEOnppViwavQ0",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Post-Share",
    allowedFormats: ["jpeg", "png", "jpg"],
  }
});

module.exports = {
  cloudinary,
  storage,
};