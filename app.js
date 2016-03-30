// load packages
var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db.js'); // contains the models & db methods
var controller = require('./lib/controllers/controllerIndex.js'); // contains references to all controllers

// set some values
var port = process.env.PORT || 3000;

// create the express application
var app = express();
var router = express.Router();

// set up some middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// User endpoints
router.route('/users')
      .post(controller.user.create);
      
// Deck endpoints
router.route('/decks')
      .get(controller.deck.getVisible)
      .post(controller.deck.create);
      
router.route('/decks/:id')
      .get(controller.deck.getOne)
      .put(controller.deck.updateOne)
      .delete(controller.deck.deleteOne);

// proof of life
app.get('/', function(req, res) {
   res.json({message: "Welcome to the Flash Card API"}); 
});

// register routes
app.use("/", router);

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

