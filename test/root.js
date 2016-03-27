var supertest = require("supertest");
var chai = require("chai");
var should = chai.should();
var port = process.env.PORT || 3000;

var server = supertest.agent("http://localhost:" + port);

// API entry point behavior
describe("Base route", function() {
   
   it("should return status code 200", function(done) {
       server.get("/")
       .end(function(err, res) {
           res.status.should.equal(200);
           res.should.be.json;
           done();
       });
   });
   
   it("should return a message", function(done) {
       server.get("/")
       .end(function(err, res) {
           res.body.should.have.property("message");
           res.body.message.should.equal("Welcome to the Flash Card API");
           done();
       });
   });
});

// Bad routes should give appropriate response
describe("Route not found", function() {
   it("should return status code 404", function(done) {
       server.get("/popsicles")
       .end(function(err, res) {
           res.status.should.equal(404);
           done();
       });
   });
});