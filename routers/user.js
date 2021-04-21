const { Router } = require("express");
const authController = require("../controllers/authController");
const User = require("../models/user");
const Post = require("../models/post");
const CatchAsync = require("../utils/CatchAsync");
const { requireAuth, checkUser } = require("../middleware/auth");
const router = Router();

//multer for multiple image
const multer = require("multer");

//cloudinary storage requirement
const { storage, cloudinary } = require("../cloudinary");

//specifying the destination of images uploaded
const upload = multer({
  storage,
});

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

router.get(
  "/profile",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    const user = res.locals.user;
    if (!user) {
      req.flash("error", "You aren't logged in!");
      return res.status(402);
    }
    res.redirect(`/user/profile/${user.username}`);
  })
);

router.get(
  "/profile/:username",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({
      username,
    });
    if (!user) {
      req.flash("error", "No user found!");
      return res.status(404);
    }
    console.log(user.likedposts.length);
    for (let pid of user.likedposts) {
      const p = await Post.findById(pid);
      if (!p) {
        console.log("doesnt exist");
        user.likedposts = user.likedposts.filter((post) => post != pid);
        // console.log("deleted");
      } else {
        console.log("exist");
      }
    }
    await user.save();
    // console.log(user.likedposts);
    const posts = await Post.find({
      author: user.id,
    }).populate("author");

    res.render("users/profile", {
      user,
      posts,
    });
  })
);

router.get(
  "/nfs",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    const user = res.locals.user;
    console.log(user);
    res.render("users/nfs", { user });
  })
);

router.post(
  "/profile/:username/nfs/:nid",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    const { username, nid } = req.params;
    const user = await User.findOne({
      username,
    });
    if (res.locals.user.id != user.id) {
      req.flash("error", "Not authorized.");
      return res.status(403).json({
        message: "Not authorized.",
      });
    }
    var f = 0;
    for (var i = user.nfs.length - 1; i >= 0; i--) {
      if (user.nfs[i].id === nid) {
        user.nfs[i].read = true;
        await user.save();
        res.json({ message: "read successfully" });
        f = 1;
        break;
      }
    }
    if (f === 0) {
      res.json({ message: "not found" });
    }
  })
);

router.get(
  "/profile/:username/edit",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({
      username,
    });
    if (res.locals.user.id != user.id) {
      req.flash("error", "Not authorized.");
      return res.status(403).json({
        message: "Not authorized.",
      });
    }

    res.render("users/editprofile", {
      user,
    });
  })
);

router.put(
  "/profile/:username",
  requireAuth,
  checkUser,
  upload.single("profile-picture"),
  CatchAsync(async (req, res) => {
    const { username } = req.params;
    const profile = req.body;
    if (username === res.locals.user.username) {
      const user = await User.findOne({
        username,
      });
      user.profile.name = profile.name;
      user.profile.bio = profile.bio;
      if (req.file) {
        await cloudinary.uploader.destroy(user.profile.avatar.filename);
        user.profile.avatar.url = req.file.path.replace(
          "/upload",
          "/upload/c_fill,h_256,w_256,g_faces,r_max"
        );
        user.profile.avatar.filename = req.file.filename;
      }
      await user.save();
      return res.redirect("/user/profile");
    } else {
      return res.status(402).json({
        message: "Not authorized",
      });
    }
  })
);

module.exports = router;
