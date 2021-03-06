var db = require('../../db.js');

var user = {};

user.create = function(req, res) {
    db.user.create(req.body).then(function(user) {
        res.status(201).json(user.toUserJSON());
    }, function(e) {
        res.status(400).json(e);
    });
};

user.getOne = function(req, res) {
    db.user.findById(req.params.id).then(function(user) {
        if (!user) return res.status(404).json({message: 'user not found'});
        res.json(user.toPublicJSON());
    }, function(e) {
        res.status(500).json(e);
    });
};

user.updateOne = function(req, res) {
    db.user.findById(req.params.id).then(function(user) {
        if (!user) return res.status(404).json({message: 'user not found'});
        user.update(req.body).then(function(user) {
            res.json(user.toUserJSON());
        }, function(e) {
            res.status(400).json(e);
        });
    }, function(e) {
        res.status(500).json(e);
    })
};

user.deleteOne = function(req, res) {
    db.user.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) return res.status(404).json({message: 'user not found'});
        res.status(204).send();
    }, function(e) {
        res.status(500).json(e);
    });
};

module.exports = user;