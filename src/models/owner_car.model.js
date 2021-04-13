const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ownerCarSchema = Schema({
  id_owner: {
    type: Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
  },
  id_place: {
    type: Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },
  id_car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
});

module.exports = model('Ownercar', ownerCarSchema);
