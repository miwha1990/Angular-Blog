var mongoose = require('mongoose');
var scema = require('../user/user.shema');
var User = mongoose.model('User', scema);
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var passport = require('passport');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var http = require('http');

module.exports = function(app) {
    function prepareResp(success, message, token) {
        return {
            success: !!success,
            msg: message,
            data: token
        }
    }

    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = 'secret';
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log('here we go', jwt_payload);
        User.findById(jwt_payload.user, done)
    }));

    app.post( '/auth/login', function (req, res) {
            User.findOne({name : req.body.name}, function(err, user) {
                if (!user) {
                    res.status(401).json(prepareResp(false, 'User not found'))
                }
                else{
                     bcrypt.compare(req.body.password, user.password, function (err, compareResult) {
                        if (err) throw err;
                        if (compareResult) {
                            var token = jwt.sign({user: user.id}, opts.secretOrKey);
                            res.status(200).json(prepareResp(true, 'Success login', token));
                        }
                    })
                }
        });
    });

    app.get('/auth/test', passport.authenticate('jwt', { session: false }), function(req, res) {
        res.send('It worked! User id is: ' + req.user.id + '.');
    });

    app.get('/me', passport.authenticate('jwt', { session: false }), function(req, res) {
        res.status(200).json(prepareResp(true, 'Success auth', req.user));
    });
};
