const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const tryCarSchema = Schema({
  id_car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  id_client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
});

module.exports = model('Trycar', tryCarSchema);
