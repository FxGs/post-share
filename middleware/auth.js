const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requireAuth = (req, res, next) => {
  // console.log("auth required" + req.session.returnTo);
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, "randomString", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
      } else {
        //console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        try {
          if (!user.verified) {
            return res.redirect(`/user/verify/${user.username}`);
          }
        } catch (err) {
          console.log(err);
        }
        next();
      }
    });
  } else {
    res.redirect("/");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "randomString", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        //console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = {
  requireAuth,
  checkUser,
};
