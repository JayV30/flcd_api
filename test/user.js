var supertest = require("supertest");
var chai = require("chai");
var should = chai.should();
var expect = chai.expect;
var port = process.env.PORT || 3000;

var server = supertest.agent("http://localhost:" + port);

var validPost = {
    "username": "TestUser",
    "email": "test@testing.edu",
    "password": "123abc",
    "apiKey": "123abc"
};

describe("User Routes", function() {
    
    describe("POST /users", function() {
        
        it("should create a user when sent valid data", function(done) {
           server.post("/users").send(validPost).expect(201).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.username.should.equal(validPost.username);
                res.body.email.should.equal(validPost.email);
                res.body.password.should.equal(validPost.password);
                res.body.apiKey.should.equal(validPost.apiKey);
                res.body.should.have.property('id');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                done();
           });
        });
        
    }); // POST /users
    
}); // User Routes