'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Customer = mongoose.model('Customer'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, customer;

/**
 * Customer routes tests
 */
describe('Customer CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Customer
    user.save(function () {
      customer = {
        name: 'Customer name'
      };

      done();
    });
  });

  it('should be able to save a Customer if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Customer
        agent.post('/api/customers')
          .send(customer)
          .expect(200)
          .end(function (customerSaveErr, customerSaveRes) {
            // Handle Customer save error
            if (customerSaveErr) {
              return done(customerSaveErr);
            }

            // Get a list of Customers
            agent.get('/api/customers')
              .end(function (customersGetErr, customersGetRes) {
                // Handle Customer save error
                if (customersGetErr) {
                  return done(customersGetErr);
                }

                // Get Customers list
                var customers = customersGetRes.body;

                // Set assertions
                (customers[0].user._id).should.equal(userId);
                (customers[0].name).should.match('Customer name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Customer if not logged in', function (done) {
    agent.post('/api/customers')
      .send(customer)
      .expect(403)
      .end(function (customerSaveErr, customerSaveRes) {
        // Call the assertion callback
        done(customerSaveErr);
      });
  });

  it('should not be able to save an Customer if no name is provided', function (done) {
    // Invalidate name field
    customer.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Customer
        agent.post('/api/customers')
          .send(customer)
          .expect(400)
          .end(function (customerSaveErr, customerSaveRes) {
            // Set message assertion
            (customerSaveRes.body.message).should.match('Please fill Customer name');

            // Handle Customer save error
            done(customerSaveErr);
          });
      });
  });

  it('should be able to update an Customer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Customer
        agent.post('/api/customers')
          .send(customer)
          .expect(200)
          .end(function (customerSaveErr, customerSaveRes) {
            // Handle Customer save error
            if (customerSaveErr) {
              return done(customerSaveErr);
            }

            // Update Customer name
            customer.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Customer
            agent.put('/api/customers/' + customerSaveRes.body._id)
              .send(customer)
              .expect(200)
              .end(function (customerUpdateErr, customerUpdateRes) {
                // Handle Customer update error
                if (customerUpdateErr) {
                  return done(customerUpdateErr);
                }

                // Set assertions
                (customerUpdateRes.body._id).should.equal(customerSaveRes.body._id);
                (customerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Customers if not signed in', function (done) {
    // Create new Customer model instance
    var customerObj = new Customer(customer);

    // Save the customer
    customerObj.save(function () {
      // Request Customers
      request(app).get('/api/customers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Customer if not signed in', function (done) {
    // Create new Customer model instance
    var customerObj = new Customer(customer);

    // Save the Customer
    customerObj.save(function () {
      request(app).get('/api/customers/' + customerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', customer.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Customer with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/customers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Customer is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Customer which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Customer
    request(app).get('/api/customers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Customer with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Customer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Customer
        agent.post('/api/customers')
          .send(customer)
          .expect(200)
          .end(function (customerSaveErr, customerSaveRes) {
            // Handle Customer save error
            if (customerSaveErr) {
              return done(customerSaveErr);
            }

            // Delete an existing Customer
            agent.delete('/api/customers/' + customerSaveRes.body._id)
              .send(customer)
              .expect(200)
              .end(function (customerDeleteErr, customerDeleteRes) {
                // Handle customer error error
                if (customerDeleteErr) {
                  return done(customerDeleteErr);
                }

                // Set assertions
                (customerDeleteRes.body._id).should.equal(customerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Customer if not signed in', function (done) {
    // Set Customer user
    customer.user = user;

    // Create new Customer model instance
    var customerObj = new Customer(customer);

    // Save the Customer
    customerObj.save(function () {
      // Try deleting Customer
      request(app).delete('/api/customers/' + customerObj._id)
        .expect(403)
        .end(function (customerDeleteErr, customerDeleteRes) {
          // Set message assertion
          (customerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Customer error error
          done(customerDeleteErr);
        });

    });
  });

  it('should be able to get a single Customer that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Customer
          agent.post('/api/customers')
            .send(customer)
            .expect(200)
            .end(function (customerSaveErr, customerSaveRes) {
              // Handle Customer save error
              if (customerSaveErr) {
                return done(customerSaveErr);
              }

              // Set assertions on new Customer
              (customerSaveRes.body.name).should.equal(customer.name);
              should.exist(customerSaveRes.body.user);
              should.equal(customerSaveRes.body.user._id, orphanId);

              // force the Customer to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Customer
                    agent.get('/api/customers/' + customerSaveRes.body._id)
                      .expect(200)
                      .end(function (customerInfoErr, customerInfoRes) {
                        // Handle Customer error
                        if (customerInfoErr) {
                          return done(customerInfoErr);
                        }

                        // Set assertions
                        (customerInfoRes.body._id).should.equal(customerSaveRes.body._id);
                        (customerInfoRes.body.name).should.equal(customer.name);
                        should.equal(customerInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Customer.remove().exec(done);
    });
  });
});
