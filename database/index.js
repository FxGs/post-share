const mongoose = require('mongoose');
const seeds = require('../database/seeds');
const posts = require('../models/post');

mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("Database connected.");
});

const postDB = async() => {
    for(let i=0; i<2; ++i) {
        const post = new posts({
            author: `${seeds[i].author}`
        });
        await post.save();
    }

};

postDB();