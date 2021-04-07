const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user');
const ImageSchema = new Schema({
  url: String,
  filename: String
});

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  title: String,
  image: [ImageSchema],
  body: String,
  date: Date
});

module.exports = mongoose.model("Post", PostSchema);