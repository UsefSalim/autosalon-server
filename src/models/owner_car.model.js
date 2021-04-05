const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ownerCarSchema = Schema({
  id_owner: {
    type: Schema.Types.ObjectId,
    ref: 'owner',
    required: true,
  },
  id_place: {
    type: Schema.Types.ObjectId,
    ref: 'place',
    required: true,
  },
  id_car: {
    type: Schema.Types.ObjectId,
    ref: 'car',
    required: true,
  },
});

module.exports = model('ownercar', ownerCarSchema);
