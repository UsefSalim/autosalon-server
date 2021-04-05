const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const clientSchema = Schema({
  first_name: {
    type: String,
    required: true,
    min: 3,
    max: 24
  },
  last_name: {
    type: String,
    required: true,
    min: 3,
    max: 24
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  cin: {
    type: String,
    required: true,
    min: 7,
    max: 8
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  global_tries: {
    type: Number,
    required: true,
    default: 0
  },
  phone: {
    type: String,
    required: true,
    min: 10,
    max: 10
  }

});

module.exports = model('client', clientSchema);
