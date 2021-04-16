const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment");

const User = require('./user');
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  image: [ImageSchema],
  body: String,
  postedat: {
    type: Date,
    default: Date.now(),
  },
  likes: {
    count: {
      type: Number,
      default: 0,
    },
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

PostSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id: {
        $in: doc.comments,
      },
    });
  }
});

module.exports = mongoose.model("Post", PostSchema);
