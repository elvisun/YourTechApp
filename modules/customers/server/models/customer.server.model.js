'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Customer name',
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
  rating: {
    type: Number,
    default: 0
  },
  address: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  email:{
    type: String
  },
  paymentMethod:{
    type: String
  },
  creditCard:{
    type: String    // use stripe
  },
  pastJobs: String,
  notes: String
});

mongoose.model('Customer', CustomerSchema);
