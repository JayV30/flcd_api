var supertest = require("supertest");
var chai = require("chai");
var should = chai.should();
var expect = chai.expect;
var port = process.env.PORT || 3000;

var db = require('../db.js');
var server = supertest.agent("http://localhost:" + port);

// reset the test db tables before and after running tests
before(function(done) {
    db.sequelize.sync({force:true}).then(function() {
        done();
    });
});

after(function(done) {
    db.sequelize.sync({force:true}).then(function() {
        done();
    });
});

// API entry point behavior
describe("Base route", function() {
   
   it("should return status code 200", function(done) {
       server.get("/")
       .end(function(err, res) {
           if (err) return done(err); 
           expect(err).to.equal(null);
           res.status.should.equal(200);
           res.should.be.json;
           done();
       });
   });
   
   it("should return a message", function(done) {
       server.get("/")
       .end(function(err, res) {
           if (err) return done(err);
           expect(err).to.equal(null);
           res.body.should.have.property("message");
           res.body.message.should.equal("Welcome to the Flash Card API");
           done();
       });
   });
});

// Bad routes should give appropriate response
describe("Invalid Routes", function() {
   it("should return status code 404", function(done) {
       server.get("/popsicles")
       .end(function(err, res) {
           if (err) return done(err);
           expect(err).to.equal(null);
           res.status.should.equal(404);
           done();
       });
   });
});