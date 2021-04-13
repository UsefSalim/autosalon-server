const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const reserveCarSchema = Schema({
  id_owner: {
    type: Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
  },
  id_client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  id_car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
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

module.exports = model('Reservecar', reserveCarSchema);
