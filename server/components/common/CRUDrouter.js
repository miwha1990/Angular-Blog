var express = require('express');
module.exports = function (app, Model) {
    var router = express.Router();

    function prepareResp(success, message, data, token) {
        return {
            success: !!success,
            msg: message,
            data: data,
            token: token,
        }
    }

    router.get('/', function(req, res, next) {
        Model.find(function (err, users){
            if (err) {
                return res.status(400).json(prepareResp(0, 'Error!!!', err));
            }
            res.status(200).json(prepareResp(1, 'List All', users));
        });
     });

    router.get('/:id', function(req, res, next) {
        Model.findById(req.params.id, function (err, users) {
            if (err) {
                return res.status(400).json(prepareResp(0, 'Error!!!', err));
            }
            res.status(200).json(prepareResp(1, 'One item', users));
        });
    });

    router.post('/', function(req, res, next) {
        var entity = new Model(req.body);
        entity.save(function (err, _entity) {
            if (err) {
                return res.status(400).json(prepareResp(0, 'Error!!!', err));
            }
            res.status(200).json(prepareResp(1, "Successful create", _entity));
        });
    });

    router.delete('/:id', function(req, res, next) {
        Model.findById(req.params.id).remove(function(err, user){
            if (err){
                return res.status(400).json(prepareResp(0, 'Error!!!', err));
            }
            res.json(prepareResp(1, "Delete Success", user));
        });
    });

    router.put('/:id', function(req ,res, next) {
        Model.findByIdAndUpdate(req.params.id,  req.body, {new:true,runValidators:true}, function(err, user){
            if (err){
                return res.status(400).json(prepareResp(0, 'Error!!!', err));
            }
            res.status(200).json(prepareResp(1, "Successful updated", user));
         })
    });
    return router;
};
