'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customer = mongoose.model('Customer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  stripe = require("stripe")("sk_test_rPjzGafM5XJhHF64SCMZlkXG");
//sk_test_rPjzGafM5XJhHF64SCMZlkXG
//sk_live_QlHF0QM3V5qYo0XYDYSvAb9a

/**
 * Create a Customer
 */
exports.create = function(req, res) {
  var customer = new Customer(req.body);
  customer.user = req.user;
  customer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * Show the current Customer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var customer = req.customer ? req.customer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customer.isCurrentUserOwner = true;

  res.jsonp(customer);
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
  var customer = req.customer ;

  customer = _.extend(customer , req.body);
  //console.log(customer);

  customer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * Delete an Customer
 */
exports.delete = function(req, res) {
  var customer = req.customer ;

  customer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * List of Customers
 */
exports.list = function(req, res) { 
  Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customers);
    }
  });
};

/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  Customer.findById(id).populate('user', 'displayName').exec(function (err, customer) {
    if (err) {
      return next(err);
    } else if (!customer) {
      return res.status(404).send({
        message: 'No Customer with that identifier has been found'
      });
    }
    req.customer = customer;
    next();
  });
};


/**
 * Customer subscription using stripe
 */

exports.subscribe = function(req, res) {
  var stripeToken = req.body.stripeToken;
  var customer = req.customer;
  stripe.customers.create({
    source: stripeToken,
    plan: "basic",
    email: customer.email
  }, function(err, subCallback) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      customer = _.extend(customer,{ subscription:true,subscriptionId:subCallback.id });
      customer.save(function(err) {
        if (err) {
          console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(customer);
        }
      });
    }
  });
};

// Subscription event listener
exports.listen = function(req,res) {
  console.log(req.body);
  var event_json = req.body;
  stripe.events.retrieve(event_json.id, function(err, event) {
    // Do something with event
    console.log(event);
    res.send(200);
  });
};








