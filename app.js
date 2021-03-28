const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const port = 3000;


app.set('view engine', 'ejs');
app.set("views", path.join("__dirname","../views"));
app.engine("ejs",ejsMate);

app.get('/', (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log('Connected.');
});