const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const placeSchema = Schema({
  place_number: {
    type: Number,
    required: true,
  },
  is_free: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = model('Place', placeSchema);
