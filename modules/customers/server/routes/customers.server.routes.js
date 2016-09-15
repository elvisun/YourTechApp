'use strict';

/**
 * Module dependencies
 */
var customersPolicy = require('../policies/customers.server.policy'),
  customers = require('../controllers/customers.server.controller');

module.exports = function(app) {
  // Customers Routes
  app.route('/api/customers').all(customersPolicy.isAllowed)
    .get(customers.list)
    .post(customers.create);

  app.route('/api/customers/:customerId')
    .get(customers.read)
    .put(customers.update)
    .delete(customers.delete);

  app.route('/api/customers/subscribe/:customerId')
    .post(customers.subscribe);

  app.route('/webhooks')
    .post(customers.listen);

  app.route('/webhooks-test')
    .post(customers.listen);

  // Finish by binding the Customer middleware
  app.param('customerId', customers.customerByID);
};
