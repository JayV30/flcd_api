var db = require('../../db.js');

var user = {};

user.create = function(req, res) {
    db.user.create(req.body).then(function(user) {
        res.status(201).json(user.toJSON());
    }, function(e) {
        res.status(400).json(e);
    });
};

module.exports = user;