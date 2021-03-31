const mongoose = require('mongoose');
const seeds = require('../database/seeds');
const Post = require('../models/post');
const {MONGOURI}=require('../keys');
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("Database connected.");
});

const postDB = async() => {
    for(let i=0; i<3; ++i) {
        const post = new Post({
            author: `${seeds[i].author}`
        });
        await post.save();
    }

};

postDB();