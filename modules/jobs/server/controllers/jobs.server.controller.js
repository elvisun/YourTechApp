'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Job = mongoose.model('Job'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Job
 */
exports.create = function(req, res) {
  var job = new Job(req.body);
  job.user = req.user;
  console.log(job);

  job.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(job);
    }
  });
};

/**
 * Show the current Job
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var job = req.job ? req.job.toJSON() : {};

  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the model.
  job.theOne = req.user && job.technician && job.technician._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(job);
};

/**
 * Update a Job
 */
exports.update = function(req, res) {
  var job = req.job;
  job = _.extend(job , req.body);
  console.log(req.body);

  job.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(job);
    }
  });
};

/**
 * Delete an Job
 */
exports.delete = function(req, res) {
  var job = req.job ;

  job.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(job);
    }
  });
};

/**
 * List of Jobs
 */
exports.list = function(req, res) { 
  Job.find().sort('-created').populate('user', 'displayName').populate('customer','name').populate('technician','displayName').exec(function(err, jobs) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(jobs);
    }
  });
};

/**
 * Job middleware
 */
exports.jobByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Job is invalid'
    });
  }
  Job.findById(id).populate('user', 'displayName').populate('customer','name').populate('technician','displayName').exec(function (err, job) {
    if (err) {
      return next(err);
    } else if (!job) {
      return res.status(404).send({
        message: 'No Job with that identifier has been found'
      });
    }
    req.job = job;
    next();
  });
};


/**
 * Take a job
 */
exports.take = function(req, res, next) {
  var job = req.job;
  job = _.extend(job , req.body);
  job.technician = req.user;

  job.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Job.findById(job._id).populate('user', 'displayName').populate('customer','name').populate('technician','displayName').exec(function (err, job) {
        if (err) {
          return next(err);
        } else if (!job) {
          return res.status(404).send({
            message: 'No Job with that identifier has been found'
          });
        }
        res.jsonp(job);
      });
    }
  });
};


/**
 * Complete a job
 */
exports.complete = function(req, res) {
  var job = req.job;
  job = _.extend(job , req.body);

  job.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(job);
    }
  });
};


/**
 * Take a job
 */
exports.abandon = function(req, res) {
  var job = req.job;
  job = _.extend(job , req.body);

  job.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(job);
    }
  });
};
