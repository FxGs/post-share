const express = require("express");
var router = express.Router();
const Post = require("../models/post");
const Comment = require("../models/comment");
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

//specifying the destination of images uploaded
const upload = multer({ storage });

router.get(
  "/",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    const posts = await Post.find({}, null, {
      sort: { comments: "desc" },
    }).populate("author");
    res.render("posts/show", { posts });
  })
);

router.post(
  "/",
  requireAuth,
  checkUser,
  upload.array("image"),
  validatePost,
  CatchAsync(async (req, res) => {
    const post = new Post(req.body.post);
    post.author = res.locals.user.id;
    post.image = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    if (post.image.length > 1) {
      for (var i = 0; i < post.image.length; i++) {
        var newurl = post.image[i].url.replace(
          "/upload",
          "/upload/h_600,g_faces"
        );
        post.image[i].url = newurl;
      }
    } else if (post.image.length == 1) {
      var newurl = post.image[0].url.replace("/upload", "/upload/g_faces");
      post.image[0].url = newurl;
    }
    // await post.save();
    // await post.populate("author");
    await post.save();
    req.flash("success", "New Post Successfully Posted!!");
    // console.log(post);
    res.redirect(`/posts/${post.id}`);
  })
);

router.get(
  "/:id",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id)
      .populate("comments")
      .populate("author").populate("likes");
    const cmnts = [];
    for (let postcomment of post.comments) {
      if (postcomment.childs.length > 0) {
        // console.log(postcomment);
        const cmnt1 = await Comment.findById(postcomment.id)
          .populate("childs")
          .populate("author");
        cmnts.push(cmnt1);
      } else {
        const cmnt2 = await Comment.findById(postcomment.id).populate("author");
        cmnts.push(cmnt2);
      }
    }
    // await post.populate("author");
    if (!post) {
      req.flash("error", "Not Found!!");
      return res.redirect("/posts");
    }
    // console.log(res.locals.user.id);
    // res.send(cmnts);
    // console.log(post.likes);
    res.render("posts/showpost", { post, cmnts });
    // console.log(post.author.username);
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
    const imgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    post.image.push(...imgs);
    await post.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await post.updateOne({
        $pull: {
          image: { filename: { $in: req.body.deleteImages } },
        },
      });
    }
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
    await Post.findByIdAndDelete(req.params.id);
    req.flash("success", "Your post is deleted!!");
    res.redirect("/posts");
  })
);

router.post(
  "/:id/likes",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    // console.log(req.params.id);
    const post = await Post.findById(req.params.id);
    console.log(post.likes.count);
    var f = 0;
    for (var i = 0; i < post.likes.likedBy.length; i++) {
      if (post.likes.likedBy[i].equals(res.locals.user.id)) {
        post.likes.likedBy.splice(i);
        post.likes.count = post.likes.likedBy.length;
        await post.save();
        res.json({ message: "disliked successfully" });
        console.log('found'+post.likes.count);
        f = 1;
        break;
      }
    }
    if (f === 0) {
      post.likes.likedBy.push(res.locals.user.id);
      post.likes.count = post.likes.likedBy.length;
      await post.save();
      res.json({ message: "liked successfully" });
      console.log('not found' + post.likes.count);
    }

    // console.log(res.locals.user.id);
    // res.redirect(`/posts/${post.id}`);
    // res.send("liked");
    // console.log("liked");
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
