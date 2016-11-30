var mongoose = require('mongoose');
module.exports = function (app) {
    mongoose.connect('mongodb://localhost/test_blog');
};