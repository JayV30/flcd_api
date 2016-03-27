// load packages
var express = require('express');
var bodyParser = require('body-parser');

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

// be quiet, the app is listening...
app.listen(port, function(err) {
    if (err) return console.log(err);
    console.log("The Flash Card API is listening on port: " + port);
});

