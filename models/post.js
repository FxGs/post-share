const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: String,
  title: String,
  body: String,
  date: Date
});

module.exports = mongoose.model("Post", PostSchema);