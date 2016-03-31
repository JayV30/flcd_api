// load testing framework
var supertest = require('supertest');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var port = process.env.PORT || 3000;
var server = supertest.agent('http://localhost:' + port);

// load test seeds
var seeds = require('./seeds.json');
var user = seeds.user;

describe('User Routes', function() {
    
    describe('POST /users', function() {
        
        it('should create a user when sent valid data', function(done) {
           server.post('/users').send(user.valid).expect(201).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.username.should.equal(user.valid.username);
                res.body.email.should.equal(user.valid.email);
                res.body.should.have.property('apiKey');
                res.body.should.have.property('id');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                done();
           });
        });
        
        it('should never return the password', function(done) {
            server.post('/users').send(user.valid2).expect(201).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.username.should.equal(user.valid2.username);
                res.body.email.should.equal(user.valid2.email);
                res.body.should.not.have.property('password');
                done();
            });
        });
        
        it('should reject empty object', function(done) {
            server.post('/users').send({}).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.should.have.property('errors');
                done();
            });
        });
        
        it('should reject empty username', function(done) {
            server.post('/users').send(user.blankUsername).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('username');
                res.body.errors[0].type.should.equal('Validation error');
                done();
            });
        });
        
        it('should reject null username', function(done) {
            server.post('/users').send(user.noUsername).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('username');
                res.body.errors[0].type.should.equal('notNull Violation');
                done();
            });
        });
        
        it('should reject empty email', function(done) {
            server.post('/users').send(user.blankEmail).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('email');
                res.body.errors[0].type.should.equal('Validation error');
                done();
            });
        });
        
        it('should reject null email', function(done) {
            server.post('/users').send(user.noEmail).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('email');
                res.body.errors[0].type.should.equal('notNull Violation');
                done();
            });
        });
        
        it('should reject non-unique email', function(done) {
           server.post('/users').send(user.valid).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeUniqueConstraintError');
                res.body.errors[0].path.should.equal('email');
                res.body.errors[0].type.should.equal('unique violation');
                done();
           });
        });
        
        it('should reject malformed email', function(done) {
            // example 1 
            server.post('/users').send(user.invalidEmail).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('email');
                res.body.errors[0].type.should.equal('Validation error');
                // example 2
                server.post('/users').send(user.invalidEmail2).expect(400).end(function(err, res) {
                    if (err) return done(err);
                    expect(err).to.equal(null);
                    res.body.name.should.equal('SequelizeValidationError');
                    res.body.errors[0].path.should.equal('email');
                    res.body.errors[0].type.should.equal('Validation error');
                    done();
                });
            });
        });
        
        it('should reject empty password', function(done) {
            server.post('/users').send(user.blankPassword).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('password');
                res.body.errors[0].type.should.equal('Validation error');
                done();
            });
        });
        
        it('should reject null password', function(done) {
            server.post('/users').send(user.noPassword).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('password');
                res.body.errors[0].type.should.equal('notNull Violation');
                done();
            });
        });
        
        it('should reject password length less than 6', function(done) {
            server.post('/users').send(user.shortPassword).expect(400).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.name.should.equal('SequelizeValidationError');
                res.body.errors[0].path.should.equal('password');
                res.body.errors[0].type.should.equal('Validation error');
                done();
            });
        });
        
    }); // POST /users
    
    describe('GET /users/:id', function() {
        
        it('should return a found user', function(done) {
            server.get('/users/1').expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.id.should.equal(1);
                done();
            });
        });
        
        it('should never return the user password', function(done) {
            server.get('/users/1').expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                res.body.should.be.json;
                res.body.id.should.equal(1);
                res.body.should.not.have.property('password');
                done();
            });
        });
        
        it('should not return the apiKey for any user if not authenticated', function(done) {
            done(); // authentication not yet impletmented
        });
        
        it('should only return apiKey if authenticated user requests own id', function(done) {
            done(); // authentication not yet impletmented
        });
        
        it('should not return the email for any user if not authenticated', function(done) {
            done(); // authentication not yet impletmented
        });
        
        it('should only return email if authenticated user requests own id', function(done) {
            done(); // authentication not yet impletmented
        });
        
        it('should return 404 if no user found', function(done) {
            server.get("/users/55").expect(404).end(function(err, res) {
                if (err) return done(err);
                expect(err).to.equal(null);
                done();
            });
        });
        
    }); // GET /users/:id
    
}); // User Routes