const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const carSchema = Schema({
  registration_number: {
    type: String,
    required: true,
    unique: true,
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
    min: 3,
  },
  price: {
    type: Number,
    required: true,
  },
  fuel: {
    type: String,
    required: true,
    ennum: ['Gasoil', 'Diesel', 'Hybrid'],
  },
  is_saled: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = model('car', carSchema);
