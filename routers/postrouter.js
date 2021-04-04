const express = require("express");
var router = express.Router();
const Post = require("../models/post");
const CatchAsync = require("../utils/CatchAsync");

//multer for multiple image
const multer = require("multer");

//cloudinary storage requirement
const { storage, cloudinary } = require("../cloudinary");

//specifying the destination of images uploaded
const upload = multer({ storage });

router.get(
  "/",
  CatchAsync(async (req, res) => {
    const posts = await Post.find({});
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
    await post.save();
    req.flash("success", "New Post Successfully Posted!!");
    // console.log(post);
    res.redirect(`/posts/${post.id}`);
  })
);

router.get(
  "/:id",
  CatchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash("error", "Not Found!!");
      return res.redirect("/posts");
    }
    res.render("posts/showpost", { post });
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

module.exports = router;
