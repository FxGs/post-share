const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

require('dotenv').config();

cloudinary.config({
  cloud_name: "fancy",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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