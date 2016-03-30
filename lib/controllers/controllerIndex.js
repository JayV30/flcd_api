var user = require('./userController.js');
var deck = require('./deckController.js');

var controllers = {
    user: user,
    deck: deck
};

module.exports = controllers;