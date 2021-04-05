const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ownerSchema = Schema({
  first_name: {
    type: String,
    required: true,
    min: 3,
    max: 24,
  },
  last_name: {
    type: String,
    required: true,
    min: 3,
    max: 24,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  cin: {
    type: String,
    required: true,
    min: 7,
    max: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  rib: {
    type: Number,
    required: true,
    min: 24,
  },
  phone: {
    type: String,
    required: true,
    min: 10,
    max: 10,
  },
});

module.exports = model('owner', ownerSchema);
