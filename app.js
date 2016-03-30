// load packages
var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db.js');

// set some values
var port = process.env.PORT || 3000;

// create the express application
var app = express();

// set up some middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// proof of life
app.get('/', function(req, res) {
   res.json({message: "Welcome to the Flash Card API"}); 
});

// Deck Routes
app.post('/decks', function(req, res) {
   db.deck.create(req.body).then(function(deck) {
       res.status(201).json(deck.toJSON());
   }, function(e) {
       res.status(400).json(e);
   });
});

app.get('/decks', function(req, res) {
    db.deck.findAll().then(function(decks) {
        res.json(decks);
    }, function(e) {
        res.status(500).json(e);
    });
});

app.get('/decks/:id', function(req, res) {
   db.deck.findById(req.params.id).then(function(deck) {
       if (!!deck) res.json(deck);
       else res.status(404).json({error: 'No deck with that id'});
   }, function(e) {
       res.status(500).json(e);
   }) 
});

app.put('/decks/:id', function(req, res) {
    db.deck.findById(req.params.id).then(function(deck) {
        if (!!deck) {
            deck.update(req.body).then(function(deck) {
                res.json(deck);
            }, function(e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).json({error: 'No deck with that id'});
        }
    }, function(e) {
        res.status(500).json(e);
    });
});

app.delete('/decks/:id', function(req, res) {
   db.deck.destroy({where: {id: req.params.id}}).then(function(rowsDeleted) {
       if (rowsDeleted === 0) {
            res.status(404).json({error: 'No deck with that id'});
        } else {
            res.status(204).send();
        }
   }, function(e) {
       res.status(500).json(e);
   });
});

// connect to the db and start the app...
db.sequelize.sync().then(function() {
    console.log("Database connection established.");
    app.listen(port, function(err) {
        if (err) return console.log(err);
        console.log("The Flash Card API is listening on port: " + port);
    });
}, function(e) {
    console.log("Error connecting to database!");
    console.log(e);
});

