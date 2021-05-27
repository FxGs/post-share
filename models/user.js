const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = require("./post");
const bcrypt = require("bcryptjs");
const { boolean } = require("joi");

const notificationsSchema = new Schema(
  {
    body: String,
    read: {
      type: Boolean,
      default: "false",
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  profile: {
    name: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    avatar: {
      url: {
        type: String,
        default: "https://bulma.io/images/placeholders/128x128.png",
      },
      filename: {
        type: String,
        default: "null",
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  likedposts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  notifications: [notificationsSchema],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Email");
};

notificationsSchema.virtual("time").get(function () {
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

module.exports = mongoose.model("User", UserSchema);
