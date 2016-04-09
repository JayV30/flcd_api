var supertest = require('supertest');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var port = process.env.PORT || 3000;
var server = supertest.agent('http://localhost:' + port);
var db = require('../db.js');

// load test seeds
var seeds = require('./seeds.json');
var deck = seeds.deck;

describe('Deck Routes', function() {

    describe('POST /decks', function() {

        it('should create a deck when sent valid data', function(done) {
            server.post('/decks').send(deck.valid).expect(201).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.title.should.equal(deck.valid.title);
                res.body.category.should.equal(deck.valid.category);
                res.body.description.should.equal(deck.valid.description);
                res.body.visible.should.equal(true);
                res.body.should.have.property('id');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                done();
            });
        });
        
        it('should require authenticated user to create a deck', function(done) {
            expect(true).to.equal(false); // auto-fail
            done(); // authentication not yet impletmented
        });
        
        it('should belong to a user on creation', function(done) {
            expect(true).to.equal(false); // auto-fail
            done(); // authentication not yet impletmented
        });
        
        it('should reject empty object', function(done) {
            server.post('/decks').send({}).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.should.have.property('errors');
                done();
            });
        });
        
        it('should reject empty title', function(done) {
            server.post('/decks').send(deck.blankTitle).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('title');
                res.body.errors[0].type.should.equal('Validation error');
                done();
            });
        });
        
        it('should reject null title', function(done) {
            server.post("/decks").send(deck.noTitle).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('title');
                res.body.errors[0].type.should.equal('notNull Violation');
                done();
            });
        });
        
        it('should reject blank category', function(done) {
            server.post('/decks').send(deck.blankCategory).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('category');
                res.body.errors[0].type.should.equal('Validation error');
                done();
            });
        });
        
        it('should reject null category', function(done) {
            server.post('/decks').send(deck.noCategory).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('category');
                res.body.errors[0].type.should.equal('notNull Violation');
                done();
            });
        });
        
        it('should assign default value to description if not provided', function(done) {
            server.post('/decks').send(deck.noDescription).expect(201).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.title.should.equal(deck.noDescription.title);
                res.body.category.should.equal(deck.noDescription.category);
                res.body.description.should.equal('');
                res.body.visible.should.equal(true);
                res.body.should.have.property('id');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                done();
            });
        });
        
        it('should allow blank description', function(done) {
            server.post('/decks').send(deck.blankDescription).expect(201).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.title.should.equal(deck.blankDescription.title);
                res.body.category.should.equal(deck.blankDescription.category);
                res.body.description.should.equal(deck.blankDescription.description);
                res.body.visible.should.equal(true);
                res.body.should.have.property('id');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                done();
            });
        });
        
        it('should reject non-boolean value for visible property', function(done) {
            server.post('/decks').send(deck.invalidVis).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeDatabaseError');
                done();
            });
        });

        it('should only accept declared model properties', function(done) {
            server.post('/decks').send(deck.extraProperties).expect(201).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.should.have.property('id');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                res.body.should.not.have.property('rejectMe');
                res.body.should.not.have.property('rejectMeAlso');
                done();
            });
        });

    }); // POST /decks

    describe("GET /decks", function() {
        
        // add 2 visible:true decks and 1 visible:false deck
        before(function(done) {
            db.sequelize.sync({force:true, match: /_test$/}).then(function() {
                server.post('/decks').send(deck.valid).then(function() {
                    server.post('/decks').send(deck.valid2).then(function() {
                        server.post('/decks').send(deck.notVisible).then(function() {
                            done();
                        });
                    });
                });
            });
        });
        
        it('should list all decks with visible:true', function(done) {
            server.get('/decks').expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.length.should.equal(2);
                done();
            });
        });

    }); // GET /decks

    describe('GET /decks/:id', function() {
        
        // add 2 visible:true decks and 1 visible:false deck
        before(function(done) {
            db.sequelize.sync({force:true, match: /_test$/}).then(function() {
                server.post('/decks').send(deck.valid).then(function() {
                    server.post('/decks').send(deck.valid2).then(function() {
                        server.post('/decks').send(deck.notVisible).then(function() {
                            done();
                        });
                    });
                });
            });
        });

        it('should get a single visible deck', function(done) {
            server.get('/decks/1').expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.id.should.equal(1);
                done();
            });
        });
        
        it('should not return a hidden deck unless authenticated user is the deck owner', function(done) {
            expect(true).to.equal(false); // auto-fail
            done(); // authentication not yet impletmented
        });
        
        it('should return 404 if no deck found', function(done) {
            server.get('/decks/55').expect(404).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                done();
            });
        });
    }); // GET /decks/:id
    
    describe('PUT /decks/:id', function() {
        
        it('should update properties and return the deck', function(done) {
            server.put('/decks/1').send(deck.updatedTitle).expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.title.should.equal(deck.updatedTitle.title);
                done();
            });
        });
        
        it('should only allow authenticated user to update', function(done) {
            expect(true).to.equal(false); // auto-fail
            done(); // authentication not yet impletmented
        });
        
        it('should not allow authenticated user to update another users deck', function(done) {
            expect(true).to.equal(false); // auto-fail
            done(); // authentication not yet impletmented
        });
        
        it('empty object should not update any values', function(done) {
            server.put('/decks/1').send({}).expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.title.should.not.equal('');
                res.body.category.should.not.equal('');
                res.body.description.should.not.equal('');
                res.body.visible.should.not.equal('');
                res.body.id.should.equal(1);
                done();
            });
        });
        
        it('should reject blank title', function(done) {
            server.put('/decks/1').send({title: deck.blankTitle.title}).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('title');
                res.body.errors[0].type.should.equal('Validation error');
                done();
            });
        });
        
        it('should reject blank category', function(done) {
            server.put('/decks/1').send({category: deck.blankCategory.category}).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('category');
                res.body.errors[0].type.should.equal('Validation error');
                done();
            });
        });
        
        it('should reject \'visible\' value that is not a boolean', function(done) {
            server.put('/decks/1').send({visible: deck.invalidVis.visible}).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeDatabaseError');
                done();
            });
        });
        
        it('should only accept declared model properties', function(done) {
            server.put('/decks/1').send(deck.extraProperties).expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.should.have.property('id');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                res.body.should.not.have.property('rejectMe');
                res.body.should.not.have.property('rejectMeAlso');
                res.body.title.should.equal(deck.extraProperties.title);
                res.body.category.should.equal(deck.extraProperties.category);
                res.body.description.should.equal(deck.extraProperties.description);
                done();
            });
        });
        
    }); // PUT /decks/:id
    
    describe('DELETE /decks/:id', function() {
        
    }); // DELETE /decks/:id

}); // Deck Routes