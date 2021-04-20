const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = require("./post");
const bcrypt = require("bcryptjs");
const { boolean } = require("joi");

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false
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
  nfs: [
    {
      body: String,
      read: {
        type: Boolean,
        default: "false"
      }
    }
  ]
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

module.exports = mongoose.model("User", UserSchema);
