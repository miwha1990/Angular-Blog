var crudRouter = require('./../common/CRUDrouter');
var router = require('./router');
var mongoose = require('mongoose');
var scema = require('./user.shema')

module.exports = function (app) {
    var User = mongoose.model('User', scema);

    app.components.User = {
        models: {
            User: User
        }
    };
        
    app.use('/users', crudRouter(app, User));
    app.use('/users', router(app, User));
};