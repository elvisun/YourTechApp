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
  taken: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  technician: {
    type:Schema.ObjectId,
    ref: 'User'
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer',
    required: 'Please fill Customer name'
  },
  appointmentDatetime: {
    type: Date
  },
  location: {
    type: String, 
    trim: true
  },
  equipments: {
    type: String, 
    trim: true
  },
  estimatedTime: {
    type: Number
  },
  taskScope: {
    type: String, 
    trim: true
  },
  notes: {
    type: String, 
    trim: true
  }
});

mongoose.model('Job', JobSchema);
