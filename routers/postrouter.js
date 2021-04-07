const express = require("express");
var router = express.Router();
const Post = require("../models/post");
const {requireAuth, checkUser} = require("../middleware/auth");
//multer for multiple image
const multer = require("multer");

//cloudinary storage requirement
const { storage, cloudinary } = require("../cloudinary");

//specifying the destination of images uploaded
const upload = multer({ storage });

router.get("/", requireAuth, async (req, res) => {
  const posts = await Post.find({});
  res.render("posts/show", { posts });
});

router.post("/", requireAuth, checkUser, upload.array("image"), async (req, res) => {
  const {body, title} = req.body;
  //console.log(res.locals.user);
  const post = new Post (req.body.post);
  post.author = res.locals.user.id;
  post.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  // // if (post.image.length == 0) {
  // //   post.image[0] = {
  // //     url: "https://bulma.io/images/placeholders/1280x960.png",
  // //   };
  // // }
  await post.save();
  res.redirect(`/posts/${post.id}`);
});

router.get("/:id", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("posts/showpost", { post });
});

router.get("/:id/edit", requireAuth,  async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("posts/edit", { post });
});

router.put("/:id", requireAuth, upload.array("image"), async (req, res) => {
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
  res.redirect(`/posts/${post.id}`);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});

module.exports = router;
