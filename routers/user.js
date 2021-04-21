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

const jwt = require('jsonwebtoken');

//specifying the destination of images uploaded
const upload = multer({
  storage,
});

require('dotenv').config();
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
    const user_profile = await User.findOne({
      username,
    });
    if (!user_profile) {
      req.flash("error", "No user found!");
      return res.status(404);
    }
    for (let pid of user_profile.likedposts) {
      const p = await Post.findById(pid);
      if (!p) {
        console.log("doesnt exist");
        user_profile.likedposts = user_profile.likedposts.filter((post) => post != pid);
      } else {
        console.log("exist");
      }
    }
    await user_profile.save();
    const posts = await Post.find({
      author: user_profile.id,
    }).populate("author");

    res.render("users/profile", {
      user_profile,
      posts,
    });
  })
);

router.get(
  "/profile/:username/nfs",
  requireAuth,
  checkUser,
  CatchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({
      username,
    });
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

router.put('/profile/:username', requireAuth, checkUser,
    upload.single("profile-picture"),
    CatchAsync(async (req, res) => {
        const {
            username
        } = req.params;
        const profile = req.body;
        if (username === res.locals.user.username) {
            const user = await User.findOne({
                username
            });
            user.profile.name = profile.name;
            user.profile.bio = profile.bio;
            if (req.file) {
                await cloudinary.uploader.destroy(user.profile.avatar.filename);
                user.profile.avatar.url = req.file.path.replace("/upload", "/upload/c_fill,h_256,w_256");
                user.profile.avatar.filename = req.file.filename;
            }
            await user.save();
            return res.redirect('/user/profile');
        } else {
            return res.status(402).json({
                message: "Not authorized"
            });
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

router.get('/verify/:username',CatchAsync(async (req,res)=>{
    const { username } = req.params;
    const user = await User.findOne({username});
    if(!user.verified) {
        authController.send_verification_mail(user.email);
    }
    res.render('users/verify',{user});
}));

router.get('/verify/token/:token', CatchAsync(async (req, res) => {
    const {
        token
    } = req.params;
    if (token) {
        jwt.verify(token, process.env.EMAIL_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
            } else {
                await User.findByIdAndUpdate(decodedToken.id, {
                    verified: true
                }, {
                    new: true
                });
                res.redirect("/posts");
            }
        });
    } else {
        res.status(403).json({
            message: 'No Verification Token Found'
        });
    }
}));

module.exports = router;
