const Post = require("../models/post");
const Comment = require("../models/comment");

const ExpressError = require("../utils/ExpressError");

const { PostSchema, CommentSchema } = require("../schemas");

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post.author.equals(res.locals.user.id)) {
    req.flash("error", "You don't have permission to do that!!");
    return res.redirect(`/posts/${id}`);
  }
  next();
};

module.exports.validatePost = (req, res, next) => {
  // const { error } = PostSchema.validate(req.body.post);
  // console.log(error);
  if (!req.body.post) {
    const msg = "post required";
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateComment = (req, res, next) => {
  const { error } = CommentSchema.validate(req.body);
  // console.log(error);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isCommentAuthor = async (req, res, next) => {
  const { id, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment.author.equals(res.locals.user.id)) {
    req.flash("error", "You don't have permission to do that!!");
    return res.redirect(`/posts/${id}`);
  }
  next();
};
