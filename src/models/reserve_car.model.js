const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const reserveCarSchema = Schema({
  id_owner: {
    type: Schema.Types.ObjectId,
    ref: 'owner',
    required: true,
  },
  id_client: {
    type: Schema.Types.ObjectId,
    ref: 'client',
    required: true,
  },
  id_car: {
    type: Schema.Types.ObjectId,
    ref: 'car',
    required: true,
  },
  proposed_reduction: {
    type: Number,
    default: 0,
  },
  is_accepted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = model('reservecar', reserveCarSchema);
