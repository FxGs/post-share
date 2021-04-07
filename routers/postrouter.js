const express = require("express");
var router = express.Router();
const Post = require("../models/post");
const Comment = require("../models/comment");
const CatchAsync = require("../utils/CatchAsync");
var ObjectId = require("mongodb").ObjectID;

//multer for multiple image
const multer = require("multer");

//cloudinary storage requirement
const { storage, cloudinary } = require("../cloudinary");

//specifying the destination of images uploaded
const upload = multer({ storage });

router.get(
  "/",
  CatchAsync(async (req, res) => {
    const posts = await Post.find({}, null, { sort: { postedat: "-1" } });
    res.render("posts/show", { posts });
  })
);

router.post(
  "/",
  upload.array("image"),
  CatchAsync(async (req, res) => {
    const post = new Post(req.body.post);
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
    await post.save();
    req.flash("success", "New Post Successfully Posted!!");
    // console.log(post);
    res.redirect(`/posts/${post.id}`);
  })
);

router.get(
  "/:id",
  CatchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id).populate("comments");
    const cmnts = [];
    for (let postcomment of post.comments) {
      if (postcomment.childs.length > 0) {
        // console.log(postcomment);
        const cmnt1 = await Comment.findById(postcomment.id).populate("childs");
        cmnts.push(cmnt1);
      } else {
        const cmnt2 = await Comment.findById(postcomment.id);
        cmnts.push(cmnt2);
      }
    }
    if (!post) {
      req.flash("error", "Not Found!!");
      return res.redirect("/posts");
    }
    // console.log(cmnts);
    // res.send(cmnts);
    res.render("posts/showpost", { post, cmnts });
  })
);

router.get(
  "/:id/edit",
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
  upload.array("image"),
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
  CatchAsync(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    req.flash("success", "Your post is deleted!!");
    res.redirect("/posts");
  })
);

router.post(
  "/:id/comments",
  CatchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.parentId = null;
    // console.log(comment.childs);
    post.comments.push(comment);
    await comment.save();
    await post.save();
    // console.log(post);
    res.redirect(`/posts/${post.id}`);
  })
);

router.get(
  "/:id/comments/:commentId",
  CatchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    const comment = await Comment.findById(commentId).populate("childs");
    if (!comment) {
      req.flash("error", "Not Found!!");
      return res.redirect(`/posts/${id}`);
    }
    // console.log(comment);
    res.render("posts/comment", { post, comment });
    // res.send(comment);
  })
);

router.post(
  "/:id/comments/:commentId",
  CatchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    const parentcomment = await Comment.findById(commentId);
    const comment = new Comment(req.body.comment);
    comment.parentId = commentId;
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
      console.log("deleted:" + c.body);
    }
    res.redirect(`/posts/${post.id}`);
  })
);

module.exports = router;
