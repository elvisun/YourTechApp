'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customer = mongoose.model('Customer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  stripe = require("stripe")("sk_live_QlHF0QM3V5qYo0XYDYSvAb9a");
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


//sub_id = event_json.data.object.customer;
//Customer.find({subscriptionId: sub_id})...... update


// WEBHOOK CHARGE SUCCEEDED EXAMPLE
// {
//   "created": 1326853478,
//   "livemode": false,
//   "id": "evt_00000000000000",
//   "type": "charge.succeeded",
//   "object": "event",
//   "request": null,
//   "pending_webhooks": 1,
//   "api_version": "2016-02-23",
//   "data": {
//     "object": {
//       "id": "ch_00000000000000",
//       "object": "charge",
//       "amount": 99,
//       "amount_refunded": 0,
//       "application_fee": null,
//       "balance_transaction": "txn_00000000000000",
//       "captured": true,
//       "created": 1473951158,
//       "currency": "cad",
//       "customer": "cus_00000000000000",
//       "description": null,
//       "destination": null,
//       "dispute": null,
//       "failure_code": null,
//       "failure_message": null,
//       "fraud_details": {},
//       "invoice": "in_00000000000000",
//       "livemode": false,
//       "metadata": {},
//       "order": null,
//       "paid": true,
//       "receipt_email": "payinguser@example.com",
//       "receipt_number": null,
//       "refunded": false,
//       "refunds": {
//         "object": "list",
//         "data": [],
//         "has_more": false,
//         "total_count": 0,
//         "url": "/v1/charges/ch_18u1EABaG5dYFgXs7oR3MvjD/refunds"
//       },
//       "shipping": null,
//       "source": {
//         "id": "card_00000000000000",
//         "object": "card",
//         "address_city": null,
//         "address_country": null,
//         "address_line1": null,
//         "address_line1_check": null,
//         "address_line2": null,
//         "address_state": null,
//         "address_zip": null,
//         "address_zip_check": null,
//         "brand": "Visa",
//         "country": "US",
//         "customer": "cus_00000000000000",
//         "cvc_check": null,
//         "dynamic_last4": null,
//         "exp_month": 9,
//         "exp_year": 2019,
//         "funding": "unknown",
//         "last4": "1111",
//         "metadata": {},
//         "name": null,
//         "tokenization_method": null
//       },
//       "source_transfer": null,
//       "statement_descriptor": null,
//       "status": "succeeded"
//     }
//   }
// }








