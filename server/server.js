
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

/*var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');*/

var userComponent = require('./components/user');
var postComponent = require('./components/post');
var db = require('./components/db');
var auth = require('./components/auth');

var port = process.env.PORT || 8081;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization,Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Headers,Access-Control-Allow-Methods");
    next();
});
// Autentification json

db(app);
app.components = {};
userComponent(app);
postComponent(app);
auth(app);

app.get('/api', function (req, res, next) {
    res.send('API is running');
});

app.listen(port, function () {
    console.log("Example app listening at http://%s:%s", 'localhost', port)
});