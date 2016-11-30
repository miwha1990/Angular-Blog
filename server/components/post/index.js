var router = require('./../common/CRUDrouter');
var mongoose = require('mongoose');
var shema = require('./post.shema.js')

module.exports = function (app) {

    app.components.Post = {
        models: {
            Post: mongoose.model('Post', shema)
        }
    };
        
    app.use('/posts', router(app, app.components.Post.models.Post));
};