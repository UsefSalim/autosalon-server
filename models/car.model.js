const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ownerSchema = Schema({
  registration_number: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    min: 1,
  },
  mark: {
    type: String,
    required: true,
    min: 1,
  },
  color: {
    type: String,
    required: true,
    min: 3
  },
  price: {
    type: Number,
    required: true,
  },
  fuel: {
    type: String,
    required: true,
    ennum: ['Gasoil', 'Diesel']
  },
  is_saled: {
    type: Boolean,
    required: true,
    default: false
  },

});

module.exports = model('owner', ownerSchema);
