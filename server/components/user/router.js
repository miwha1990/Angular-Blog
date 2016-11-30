/**
 * Created by dev6 on 16.06.16.
 */
var express = require('express');


module.exports = function (app, Model) {
    var router = express.Router();

    router.post('/asdf', function (req, res) {
        res.status(200).json({asdf:'ok'});
    });

    return router;
};