const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

const PostSchema = new Schema({
  author: String,
  title: String,
  image: [ImageSchema],
  body: String,
  date: Date
});

module.exports = mongoose.model("Post", PostSchema);