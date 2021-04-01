const express = require("express");
var router = express.Router();
const Post = require("../models/post");

//multer for multiple image
const multer = require("multer");

//cloudinary storage requirement
const { storage } = require("../cloudinary");

//specifying the destination of images uploaded
const upload = multer({ storage });

router.get("/", async (req, res) => {
  const posts = await Post.find({});
  res.render("posts/show", { posts });
});

router.post("/", upload.array("image"), async (req, res) => {
  const post = new Post(req.body.post);
  post.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await post.save();
  res.redirect(`/posts/${post.id}`);
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("posts/showpost", { post });
});

router.get("/:id/edit", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("posts/edit", { post });
});

router.put("/:id", async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, {
    ...req.body.post,
  });
  await post.save();
  res.redirect(`/posts/${post.id}`);
});

router.delete("/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});

module.exports = router;
