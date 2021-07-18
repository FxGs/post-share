const express = require("express");
var router = express.Router();
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const { requireAuth, checkUser } = require("../middleware/auth");
const {
  isAuthor,
  validatePost,
  validateComment,
  isCommentAuthor,
} = require("../middleware/validatepost");
const { PostSchema, CommentSchema } = require("../schemas");
const CatchAsync = require("../utils/CatchAsync");

//multer for multiple image
const multer = require("multer");

//cloudinary storage requirement
const { storage, cloudinary } = require("../cloudinary");

// //specifying the destination of images uploaded
const upload = multer({ storage });

router.get(
  "/",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    const posts = await Post.find({}, null, {
      sort: { createdAt: -1 },
    }).populate("author");
    res.render("posts/show", { posts });
  })
);

router.post(
  "/",
  requireAuth,
  checkUser,
  validatePost,
  CatchAsync(async (req, res) => {
    // console.log("success");
    try {
      // console.log(req.body);
      const post = new Post(req.body.post);
      post.author = res.locals.user.id;
      var u;
      if (req.body.image) {
        const type = typeof req.body.image;
        if (type === "string") {
          // console.log(type + ":one");
          var fileStr = JSON.parse(req.body.image);
          // console.log(fileStr.metadata);
          var url = "data:" + fileStr.type + ";base64," + fileStr.data;
          var uploadResponse = await cloudinary.uploader.upload(url, {
            folder: "Post-Share",
            allowedFormats: ["jpeg", "png", "jpg"],
          });
          // console.log(uploadResponse);
          const iurl = uploadResponse.secure_url;
          const filename = uploadResponse.public_id;
          // console.log(iurl, filename);
          post.image.push({
            url: iurl,
            filename: filename,
          });
          u = url;
        } else {
          // console.log(type + ":multi");
          const ilength = req.body.image.length;
          // console.log(ilength);
          for (var i = 0; i < ilength; i++) {
            var fileStr = JSON.parse(req.body.image[i]);
            var url = "data:" + fileStr.type + ";base64," + fileStr.data;
            var uploadResponse = await cloudinary.uploader.upload(url, {
              folder: "Post-Share",
              allowedFormats: ["jpeg", "png", "jpg"],
            });
            // console.log(uploadResponse);
            const iurl = uploadResponse.secure_url;
            const filename = uploadResponse.public_id;
            // console.log(iurl, filename);
            post.image.push({
              url: iurl,
              filename: filename,
            });
          }
        }
      }

      await post.save();
      // console.log(post.createdAt);
      req.flash("success", "New Post Successfully Posted!!");
      // console.log(post);
      // res.redirect(`/posts/${post.id}`);
      res.json(post.id);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "Something went wrong" });
    }
  })
);

router.get(
  "/new",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    res.render("posts/new");
  })
);

router.get(
  "/:id",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id)
      .populate("comments")
      .populate("author")
      .populate("likes");
    if (!post) {
      req.flash("error", "This post is no longer available");
      return res.redirect("back");
    } else {
      const cmnts = [];
      for (let postcomment of post.comments) {
        if (postcomment.childs.length > 0) {
          // console.log(postcomment);
          const cmnt1 = await Comment.findById(postcomment.id)
            .populate("childs")
            .populate("author");
          cmnts.push(cmnt1);
        } else {
          const cmnt2 = await Comment.findById(postcomment.id).populate(
            "author"
          );
          cmnts.push(cmnt2);
        }
      }
      // await post.populate("author");
      res.render("posts/showpost", { post, cmnts });
      // console.log(post.author.username);
    }
  })
);

router.get(
  "/:id/edit",
  requireAuth,
  checkUser,
  isAuthor,
  CatchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash("error", "Not Found!!");
      return res.redirect("/posts");
    }
    res.render("posts/edit", { post });
  })
);

router.put(
  "/:id",
  requireAuth,
  checkUser,
  isAuthor,
  upload.array("image"),
  validatePost,
  CatchAsync(async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      ...req.body.post,
    });
    req.flash("success", "You have Updated your post Successfully!!");
    res.redirect(`/posts/${post.id}`);
  })
);

router.delete(
  "/:id",
  requireAuth,
  checkUser,
  isAuthor,
  CatchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    // console.log(post.image.length);
    if (post.image.length > 0) {
      for (var i = 0; i < post.image.length; i++) {
        await cloudinary.uploader.destroy(post.image[i].filename);
      }
    }
    await Post.findByIdAndDelete(req.params.id);
    req.flash("success", "Your post is deleted!!");
    res.redirect("/posts");
  })
);

router.post(
  "/:id/like",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    // console.log("liked");
    const post = await Post.findById(req.params.id);
    const user = res.locals.user;
    if (!user.likedposts.includes(post.id)) {
      // console.log("not contain");
      user.likedposts.push(post.id);
      await user.save();
      post.likes.count = post.likes.count + 1;
    }
    const newpost = await post.save();
    res.json(newpost.likes.count);
  })
);

router.post(
  "/:id/dislike",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    // console.log("disliked");
    const post = await Post.findById(req.params.id);
    const user = res.locals.user;

    const index = user.likedposts.indexOf(post.id);
    if (index > -1) {
      user.likedposts.splice(index, 1);
      await user.save();
      post.likes.count = post.likes.count - 1;
    }
    const newpost = await post.save();
    res.json(newpost.likes.count);
  })
);

router.post(
  "/:id/comments",
  requireAuth,
  checkUser,
  validateComment,
  CatchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.parentId = null;
    comment.author = res.locals.user.id;
    // console.log(comment.childs);
    post.comments.push(comment);
    await comment.save();
    await post.save();
    const user = await User.findById(post.author);
    if (!res.locals.user.equals(user)) {
      const mssg = {
        body: `<a href="/user/profile/${res.locals.user.username}">${res.locals.user.username}</a> commented on your post <a href="/posts/${post.id}">${post.title}</a>.`,
      };
      user.notifications.push(mssg);
      await user.save();
    }
    // console.log(post);
    res.redirect(`/posts/${post.id}`);
  })
);

router.post(
  "/:id/comments/:commentId",
  requireAuth,
  checkUser,
  validateComment,
  CatchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    const parentcomment = await Comment.findById(commentId);
    const comment = new Comment(req.body.comment);
    comment.parentId = commentId;
    comment.author = res.locals.user.id;
    parentcomment.childs.push(comment.id);
    // console.log(parentcomment.childs);
    post.comments.push(comment);
    await comment.save();
    await parentcomment.save();
    await post.save();
    const user = await User.findById(parentcomment.author);
    if (!res.locals.user.equals(user)) {
      const mssg = {
        body: `<a href="/user/profile/${res.locals.user.username}">${res.locals.user.username}</a> replied on your comment on post <a href="/posts/${post.id}">${post.title}</a>`,
      };
      user.notifications.push(mssg);
      await user.save();
    }
    // console.log(post);
    res.redirect(`/posts/${id}`);
  })
);

router.delete(
  "/:id/comments/:commentId",
  requireAuth,
  checkUser,
  isCommentAuthor,
  CatchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    // console.log(id);
    const post = await Post.findById(id).populate("comments");
    const comment = await Comment.findById(commentId);
    // console.log(post);
    // console.log(post.comments.length);
    var pId = commentId;
    // const c = await Comment.findById(pId);
    // console.log(c);

    await loadchildcomments(pId);
    async function loadchildcomments(pId) {
      const c = await Comment.findById(pId);
      // console.log(c.body);
      if (c.childs.length > 0) {
        for (let child of c.childs) {
          await Comment.findByIdAndUpdate(c.id, { $pull: { childs: child } });
          await loadchildcomments(child);
        }
      }
      // console.log(pId);
      await Post.findByIdAndUpdate(id, { $pull: { comments: pId } });
      await Comment.findByIdAndDelete(pId);
      // console.log("deleted:" + c.body);
    }
    res.redirect(`/posts/${post.id}`);
  })
);

module.exports = router;
