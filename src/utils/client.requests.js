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
    'id_owner id_place -_id'
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
exports.profileClient = async ({ _id }) => {
  const allCars = await Car.find({ is_saled: false });
  const carsWithIdClient = await ReserveCar.find({
    id_client: _id,
  }).populate('id_car');

  const reservedCarWithreduction = carsWithIdClient.filter(
    (car) => car.proposed_reduction > 0 && car.is_accepted === false
  );
  const reserverdCar = carsWithIdClient.filter(
    (car) => car.is_accepted === true
  );
  return {
    reserverdCar,
    allCars,
    reservedCarWithreduction,
  };
};

exports.getCurrentCar = async (id_car) => await Car.findOne({ _id: id_car });
exports.ifCarEsseyed = async (id_car, id_client) =>
  await TryCar.findOne({ id_car, id_client });
exports.esseyVoitureRequest = async (id_client, id_car, GlobalTries) => {
  const task = Fawn.Task();
  const newTryCar = new TryCar({
    id_car,
    id_client,
  });
  const saveTryCarAndUpdateClient = await task
    .save('trycar', newTryCar)
    .update(
      'client',
      { _id: id_client },
      { $set: { global_tries: GlobalTries + 1 } }
    )
    .run({ useMongoose: true });
  if (saveTryCarAndUpdateClient)
    return {
      saveTryCarAndUpdateClient,
    };
};

exports.reserverdCarWithReduction = async (
  id_car,
  id_client,
  proposed_reduction,
  res
) => {
  const { id_owner } = await this.findIdOwnerFromIdCar(id_car);
  const newReservation = new ReserveCar({
    id_car,
    id_client,
    id_owner,
    proposed_reduction,
  });
  const reservedCar = await newReservation.save();
  if (reservedCar)
    return res.status(200).json('Car reserver avec demande de reduction');
};

exports.reservationwithoutReduction = async (id_car, id_client, res) => {
  const task = Fawn.Task();
  const { id_owner, id_place } = await this.findIdOwnerFromIdCar(id_car);
  const newReservation = new ReserveCar({
    id_car,
    id_client,
    id_owner,
    is_accepted: true,
  });
  const savereservCarAndUpdateCar = await task
    .save('reservecar', newReservation)
    .update('Car', { _id: id_car }, { $set: { is_saled: true } })
    .update('Place', { _id: id_place }, { $set: { is_free: true } })
    .update('Reservecar', { id_car }, { $set: { proposed_reduction: 0 } })
    .run({ useMongoose: true });
  if (savereservCarAndUpdateCar)
    return res.status(200).json('Car Reserved avecSuccess');
};
