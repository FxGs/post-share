const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  parentId: Schema.Types.ObjectId,
  childs: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdat: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("Comment", CommentSchema);
