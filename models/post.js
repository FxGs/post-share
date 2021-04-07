const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const PostSchema = new Schema({
  author: String,
  title: String,
  image: [ImageSchema],
  body: String,
  postedat: {
    type: Date,
    default: Date.now(),
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
