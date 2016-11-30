
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var uniqueValidator = require('mongoose-unique-validator');

// set up a mongoose model
var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['Client', 'Manager', 'Admin'],
        default: 'Client'
    }
});

UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) throw err;
        console.log(hash);
        user.password = hash;
        next();
    });
});

UserSchema.plugin(uniqueValidator);
module.exports = UserSchema;