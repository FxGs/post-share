const express = require('express');
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const port = 3000;
const mongoose = require("mongoose");
const Post = require("./models/post");
const {MONGOURI}=require('./keys');


mongoose.connect(MONGOURI, {
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

app.set('view engine', 'ejs');
app.set("views", path.join("__dirname","../views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.get('/', (req, res) => {
  res.render("home");
});

app.get("/posts", async (req, res) => {
  const posts = await Post.find({});
  res.render("posts/show", {posts});
});

app.post("/posts", async (req, res) => {
  const post = new Post(req.body.post);
  await post.save();
  // console.log(post);
  res.redirect(`/posts/${post.id}`);
});

app.get("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("posts/showpost", { post });
});

app.get("/posts/:id/edit", async (req, res) =>{
  const post = await Post.findById(req.params.id);
  res.render("posts/edit", { post });
});

app.put("/posts/:id", async (req, res) =>{
  const post = await Post.findByIdAndUpdate(req.params.id, {...req.body.post});
  await post.save();
  // console.log(post);
  res.redirect(`/posts/${post.id}`);
});
app.delete("/posts/:id", async(req, res) =>{
  await Post.findByIdAndDelete(req.params.id);
  // console.log(req.params.id);
  res.redirect("/posts");
})
app.get("/contacts", (req, res) => {
  res.render("posts/contacts");
})

app.get("/status", (req, res) => {
  res.render("status");
})

app.get('*', (req, res) => {
  res.send("not found");
});

app.listen(port, () => {
  console.log('Connected.');
});