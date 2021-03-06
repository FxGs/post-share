const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment");

mongoose.set("toJSON", { virtuals: true });

const User = require("./user");
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const PostSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    image: [ImageSchema],
    body: String,
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
  },
  {
    timestamps: true,
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

PostSchema.virtual("time").get(function () {
  const date1 = this.createdAt;
  const date2 = Date.now();
  const diff = date2 - date1;

  const days = parseInt(diff / (24 * 60 * 60 * 1000));
  const hrs = parseInt(diff / (60 * 60 * 1000));
  const mins = parseInt(diff / (60 * 1000));
  const secs = parseInt(diff / 1000);

  var s = "";
  if (diff > 5 * 24 * 60 * 60 * 1000) {
    s = this.createdAt.toDateString();
  } else if (diff > 24 * 60 * 60 * 1000) {
    if (days > 1) {
      s = days + " days ago";
    } else {
      s = days + " day ago";
    }
  } else if (diff > 60 * 60 * 1000) {
    if (hrs > 1) {
      s = hrs + " hours ago";
    } else {
      s = hrs + " hour ago";
    }
  } else if (diff > 60 * 1000) {
    if (mins > 1) {
      s = mins + " minutes ago";
    } else {
      s = mins + " minute ago";
    }
  } else {
    if (secs > 1) {
      s = secs + " seconds ago";
    } else {
      s = secs + " second ago";
    }
  }
  return s;
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
