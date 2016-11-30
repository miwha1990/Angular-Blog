
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// set up a mongoose model
var PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    thumbnail: String,
    author:{
        type: String
    }
});

module.exports = PostSchema;