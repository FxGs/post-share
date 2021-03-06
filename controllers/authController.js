const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {
    email: "",
    password: "",
  };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60; // 3 days
const createToken = (id, secret, time = maxAge) => {
  return jwt.sign(
    {
      id,
    },
    secret,
    {
      expiresIn: time,
    }
  );
};

// controller actions
const signup_get = (req, res) => {
  res.render("users/signup");
};

const login_get = (req, res) => {
  res.render("users/login");
};

const signup_post = async (req, res) => {
  // console.log(req.body);
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    const token = createToken(user._id, process.env.JWT_SECRET);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.redirect("/posts");
    // res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({
      errors,
    });
  }
};

const login_post = async (req, res) => {
  // console.log(req.body);
  // console.log("login" + req.session.returnTo);
  var redirecturl = req.session.returnTo || "/posts";
  const { email, password } = req.body;

  // console.log("email: " + email);
  try {
    let user = await User.login(email, password);
    const token = createToken(user._id, process.env.JWT_SECRET);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    // console.log(redirecturl);
    res.json({ message: "success", url: redirecturl });
    // res.redirect("/posts");
  } catch (err) {
    const errors = handleErrors(err);
    // req.flash("error","login again!!");
    // res.redirect('/login');
    res.json({ errors });
  }
};

const logout_get = (req, res) => {
  req.session.returnTo = null;
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.redirect("/");
};

const send_verification_mail = async (email, url) => {
  var user = await User.findOne({
    email,
  });
  if (!user.verified) {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const token = createToken(user._id, process.env.EMAIL_SECRET);
    const emailBody = `Click on this link to verify your email address - <a href=${url}/user/verify/token/${token}>Verify</a>`;
    let info = await transporter.sendMail({
      from: `"Post-Share App" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Post-Share App email-verification",
      text: `${emailBody}`,
      html: `<p>${emailBody}</p>`,
    });
    console.log(
      `Message sent: ${info.messageId} to ${user.email} at ${Date.now()}`
    );
  } else {
    res.redirect(`/user/verify/${user.username}`);
  }
};
module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout_get,
  send_verification_mail,
};
