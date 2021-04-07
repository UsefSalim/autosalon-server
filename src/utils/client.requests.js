/* eslint-disable no-return-await */
/* eslint-disable camelcase */
const Fawn = require('fawn');
const TryCar = require('../models/try_car.model');
const Car = require('../models/car.model');
const OwnerCar = require('../models/owner_car.model');
const ReserveCar = require('../models/reserve_car.model');
const Owner = require('../models/owner.model');

exports.findIdOwnerFromIdCar = async (id_car) => {
  const { id_owner, id_place } = await OwnerCar.findOne({ id_car }).select(
    'id_owner -_id'
  );
  return { id_owner, id_place };
};
exports.reservationRequest = async (id_car) => {
  const { id_owner } = await this.findIdOwnerFromIdCar(id_car);
  if (id_owner)
    return {
      infoCar: await Car.findOne({ _id: id_car }),
      infoOwner: await Owner.findOne({ _id: id_owner }).select('-password'),
    };
};
exports.findAll = async (validation) =>
  await Car.find({ is_saled: validation });
exports.getCurrentCar = async (id_car) => await Car.findOne({ _id: id_car });

exports.esseyVoitureRequest = async (id_client, id_car, newGlobalTries) => {
  const task = Fawn.Task();
  const newTryCar = new TryCar({
    id_car,
    id_client,
  });
  const currentCar = this.getCurrentCar(id_car);
  return {
    currentCar,
    ifCarEsseyed: await TryCar.findOne({ id_car, id_client }),
    saveTryCarAndUpdateClient: await task
      .save('trycar', newTryCar)
      .update(
        'client',
        { _id: id_client },
        { $set: { global_tries: newGlobalTries } }
      )
      .run({ useMongoose: true }),
  };
};

exports.reserverdCarWithReduction = async (
  id_car,
  id_client,
  proposed_reduction,
  res
) => {
  const { id_owner } = await this.findIdOwnerFromIdCar(id_car);
  console.log(id_owner);
  const newReservation = new ReserveCar({
    id_car,
    id_client,
    id_owner,
    proposed_reduction,
  });
  const reservedCar = await newReservation.save();
  if (reservedCar)
    return res
      .status(200)
      .json({ ReserverdCar: 'Car reserver avec demande de reduction' });
};

exports.reservationwithoutReduction = async (id_car, id_client, res) => {
  const task = Fawn.Task();
  const { id_owner, id_place } = await this.findIdOwnerFromIdCar(id_car);
  const newReservation = new ReserveCar({
    id_car,
    id_client,
    id_owner,
  });
  const savereservCarAndUpdateCar = await task
    .save('reservecar', newReservation)
    .update('car', { _id: id_car }, { $set: { is_saled: true } })
    .update('place', { _id: id_place }, { $set: { is_free: true } }) //! !!!!
    .run({ useMongoose: true });
  if (savereservCarAndUpdateCar)
    return res.status(200).json('Car Reserved avecSuccess');
};
