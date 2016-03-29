var supertest = require("supertest");
var chai = require("chai");
var should = chai.should();
var expect = chai.expect;
var port = process.env.PORT || 3000;

var server = supertest.agent("http://localhost:" + port);

var validPost = {
    "title": "Title",
    "category": "Category",
    "description": "Description",
    "visible": true
};

describe("Deck Routes", function() {
    
    describe("POST /decks", function() {
        
        it("should create a deck when sent valid data", function(done) {
            server.post("/decks").send(validPost).expect(201).end(function(err, res) {
                if (err) return done(err); 
                expect(err).to.equal(null);
                res.body.title.should.equal(validPost.title);
                res.body.category.should.equal(validPost.category);
                res.body.description.should.equal(validPost.description);
                res.body.visible.should.equal(validPost.visible);
                res.body.should.have.property('id');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                done();
            });
        });
        
        it("should reject invalid data", function(done) {
            // empty object
            server.post("/decks").send({}).expect(400).end(function(err, res) {
                if (err) return done(err); 
                expect(err).to.equal(null);
                res.body.name.should.equal("SequelizeValidationError");
                res.body.should.have.property('errors');
            });
            // empty title
            server.post("/decks").send({
                "title": "",
                "category": "Category",
                "description": "Description",
                "visible": true
            }).expect(400).end(function(err, res) {
                if (err) return done(err); 
                expect(err).to.equal(null);
                res.body.name.should.equal("SequelizeValidationError");
                res.body.errors[0].path.should.equal('title');
                res.body.errors[0].type.should.equal('Validation error');
            });
            // no title
            server.post("/decks").send({
                "category": "Category",
                "description": "Description",
                "visible": true
            }).expect(400).end(function(err, res) {
                if (err) return done(err); 
                expect(err).to.equal(null);
                res.body.name.should.equal("SequelizeValidationError");
                res.body.errors[0].path.should.equal('title');
                res.body.errors[0].type.should.equal('notNull Violation');
            });
            // empty category
            server.post("/decks").send({
                "title": "Title",
                "category": "",
                "description": "Description",
                "visible": true
            }).expect(400).end(function(err, res) {
                if (err) return done(err); 
                expect(err).to.equal(null);
                res.body.name.should.equal("SequelizeValidationError");
                res.body.errors[0].path.should.equal('category');
                res.body.errors[0].type.should.equal('Validation error');
            });
            // no category
            server.post("/decks").send({
                "title": "Title",
                "description": "Description",
                "visible": true
            }).expect(400).end(function(err, res) {
                if (err) return done(err); 
                expect(err).to.equal(null);
                res.body.name.should.equal("SequelizeValidationError");
                res.body.errors[0].path.should.equal('category');
                res.body.errors[0].type.should.equal('notNull Violation');
            });
            // empty description -- null is allowed, empty is not
            server.post("/decks").send({
                "title": "Title",
                "category": "Category",
                "description": "",
                "visible": true
            }).expect(400).end(function(err, res) {
                if (err) return done(err); 
                expect(err).to.equal(null);
                res.body.name.should.equal("SequelizeValidationError");
                res.body.errors[0].path.should.equal('description');
                res.body.errors[0].type.should.equal('Validation error');
                done();
            });
        });
        
        it("should only accept declared model properties", function(done) {
            server.post("/decks").send({
                "title": "Title",
                "category": "Category",
                "description": "Description",
                "visible": true,
                "propToReject": "this one",
                "anotherToReject": "this one also"
            }).expect(201).end(function(err, res) {
                if (err) return done(err); 
                expect(err).to.equal(null);
                res.body.should.have.property('id');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                res.body.should.not.have.property('propToReject');
                res.body.should.not.have.property('anotherToReject');
                done();
            });
        });

    }); // POST /decks
    
    describe("GET /decks", function() {
        
        it("should list all decks", function(done) {
           server.get("/decks").expect(200).end(function(err, res) {
               if (err) return done(err);
               expect(err).to.equal(null);
               done();
           });
        });
    }); // GET /decks
    
}); // Deck Routes