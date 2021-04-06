const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const tryCarSchema = Schema({
  id_car: {
    type: Schema.Types.ObjectId,
    ref: 'car',
    required: true,
  },
  id_client: {
    type: Schema.Types.ObjectId,
    ref: 'client',
    required: true,
  },
});

module.exports = model('trycar', tryCarSchema);
