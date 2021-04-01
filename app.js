const express = require('express');
const methodOverride = require('method-override');

const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const port = 3000;
const mongoose = require("mongoose");
const { MONGOURI } = require('./keys');
const postroutes = require("./routers/postrouter");


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

app.use("/posts", postroutes);

app.get("/contacts", (req, res) => {
  res.render("posts/contacts");
})

app.get('*', (req, res) => {
  res.send("not found");
});

app.listen(port, () => {
  console.log('Connected.');
});