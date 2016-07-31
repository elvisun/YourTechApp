'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Job Schema
 */
var JobSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Job name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: Number,     // 0 for uncomplete, 1 for in progress, 2 for completed
    default: 0   
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer'
  },
  appointmentTime: {
    type: Date
  },
  location: {
    type: String
  },
  equipment: {
    type: String
  },
  estimatedTime: {
    type: Number
  },
  taskScope: {
    type: String
  },
});

mongoose.model('Job', JobSchema);
