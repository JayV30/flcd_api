var db = require('../../db.js');

var deck = {};

deck.getAll = function(req, res) {
    db.deck.findAll().then(function(decks) {
        res.json(decks);
    }, function(e) {
        res.status(500).json(e);
    });
};

deck.getVisible = function(req, res) {
    db.deck.findAll({where: {visible: true}}).then(function(decks) {
        res.json(decks);
    }, function(e) {
        res.status(500).json(e);
    });
};

deck.create = function(req, res) {
    db.deck.create(req.body).then(function(deck) {
       res.status(201).json(deck.toJSON());
    }, function(e) {
       res.status(400).json(e);
    });
};

deck.getOne = function(req, res) {
    db.deck.findById(req.params.id).then(function(deck) {
       if (!!deck) res.json(deck);
       else res.status(404).send();
    }, function(e) {
       res.status(500).json(e);
    });    
};

deck.updateOne = function(req, res) {
    db.deck.findById(req.params.id).then(function(deck) {
        if (!!deck) {
            deck.update(req.body).then(function(deck) {
                res.json(deck);
            }, function(e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    }, function(e) {
        res.status(500).json(e);
    });
};

deck.deleteOne = function(req, res) {
    db.deck.destroy({ where: { id: req.params.id }}).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).send();
        } else {
            res.status(204).send();
        }
    }, function(e) {
        res.status(500).send();
    });
};

module.exports = deck;