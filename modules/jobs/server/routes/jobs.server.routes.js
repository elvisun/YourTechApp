'use strict';

/**
 * Module dependencies
 */
var jobsPolicy = require('../policies/jobs.server.policy'),
  jobs = require('../controllers/jobs.server.controller');

module.exports = function(app) {
  // Jobs Routes
  app.route('/api/jobs').all(jobsPolicy.isAllowed)
    .get(jobs.list)
    .post(jobs.create);

  app.route('/api/jobs/:jobId').all(jobsPolicy.isAllowed)
    .get(jobs.read)
    .put(jobs.update)
    .delete(jobs.delete);

  app.route('/api/jobs/takejob/:jobId').all(jobsPolicy.isAllowed)
    .post(jobs.take);

  app.route('/api/jobs/completejob/:jobId').all(jobsPolicy.isAllowed)
    .post(jobs.complete);

  app.route('/api/jobs/abandonjob/:jobId').all(jobsPolicy.isAllowed)
    .post(jobs.abandon);

  // Finish by binding the Job middleware
  app.param('jobId', jobs.jobByID);
};
