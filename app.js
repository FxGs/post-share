const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const port = 3000;
const mongoose = require("mongoose");
const Post = require("./models/post");

mongoose.connect("mongodb://localhost:27017/posts", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Database connected.");
});

app.set('view engine', 'ejs');
app.set("views", path.join("__dirname","../views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("home");
});

app.get("/posts", async (req, res) => {
  const posts = await Post.find({});
  res.render("posts/show", {posts});
});

app.get("/posts/new", (req, res) => {
  res.render("posts/new");
});

app.post("/posts", async (req, res) => {
  const post = new Post(req.body.post);
  await post.save();
  console.log(post);
  res.redirect(`/posts/${post.id}`);
});

app.get("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("posts/showpost", { post });
});

app.get('*', (req, res) => {
  res.send("not found");
});

app.listen(port, () => {
  console.log('Connected.');
});