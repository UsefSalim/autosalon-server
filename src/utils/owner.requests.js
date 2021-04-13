/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
const Fawn = require('fawn');
const Car = require('../models/car.model');
const OwnerCar = require('../models/owner_car.model');
const ReserveCars = require('../models/reserve_car.model');
const Place = require('../models/place.model');

exports.allCarsByIdOwner = async (owner) => ({
  allCars: await OwnerCar.find({ id_owner: owner._id })
    .populate('id_car')
    .select('id_car, -_id'),
});

exports.profileRequests = async (owner) => {
  const { allCars } = await this.allCarsByIdOwner(owner);
  const allSaledCars = allCars.filter(
    (carsOwner) => carsOwner.is_saled === true
  );
  const reservedCars = await ReserveCars.find({
    id_owner: owner._id,
    is_accepted: false,
  }).populate('id_car');
  const carWitProposition = reservedCars.filter(
    (reserverdCar) => reserverdCar.proposed_reduction > 0
  );
  return {
    ownerCars: allCars,
    reserveCars: allSaledCars,
    reserveCarReduction: carWitProposition,
  };
};

exports.addCarsRequests = async (Owner, req) => {
  const placeDispo = await Place.findOne({ is_free: true });
  const newCar = new Car({ ...req.body });
  const createOwnerCar = new OwnerCar({
    id_owner: Owner._id,
    id_place: placeDispo._id,
    id_car: newCar._id,
  });
  const task = Fawn.Task();
  if (placeDispo) {
    const createCarAndOwnerCarAndUpdateDisponibility = await task
      .save('car', newCar)
      .save('ownercar', createOwnerCar)
      .update(
        'place',
        { _id: placeDispo._id },
        {
          $set: {
            is_free: false,
          },
        }
      )
      .run({ useMongoose: true });
    const { ownerCars } = await this.profileRequests(Owner._id);
    if (createCarAndOwnerCarAndUpdateDisponibility && ownerCars)
      return {
        createCarAndOwnerCarAndUpdateDisponibility,
        ownerCars,
      };
  }
};
