const express = require("express");
const methodOverride = require("method-override");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const port = 3000;
const mongoose = require("mongoose");
const Post = require("./models/post");
const user = require("./routers/user");
const postroutes = require("./routers/postrouter");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/auth");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Database connected.");
});

app.set("view engine", "ejs");
app.set("views", path.join("__dirname", "../views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ limit: '10mb',extended: true }));
app.use(methodOverride("_method"));

app.use(express.json());
app.use(cookieParser());

app.get("*", checkUser);
const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", checkUser, (req, res) => {
  if(res.locals.user)
    return res.redirect('/posts');
  res.render("particle");
});


app.get("/particle", (req, res) => {
  res.render("particle");
});

app.use("/user", user);
app.use("/posts", requireAuth, postroutes);

app.get("/contacts", requireAuth, checkUser, (req, res) => {
  res.render("posts/contacts");
});

app.post("/email", requireAuth, checkUser, (req, res) => {
  console.log(req.body);
  if (!req.body.text && !req.body.subject) {
    res.send("error");
  }
});

app.get("*", (req, res) => {
  res.render("status");
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!!";
  res.status(statusCode).render("error1", { err });
});

app.listen(port, () => {
  console.log(`Connected on port ${port}`);
});
