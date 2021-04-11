/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
const Fawn = require('fawn');
const Car = require('../models/car.model');
const OwnerCar = require('../models/owner_car.model');
const ReserveCars = require('../models/reserve_car.model');
const Place = require('../models/place.model');

exports.profileRequests = async ({ _id }) => {
  const ownerCars = await OwnerCar.find({ id_owner: _id });
  const ids_reserverdCarWithReduction = [];
  const allReserverdCarWithReduction = [];
  const carsReserved = [];
  const ids_cars = [];
  const carsOwner = [];
  const carsSaled = [];
  if (ownerCars) {
    ownerCars.map((car) => {
      ids_cars.push(car.id_car);
    });
    for (let index = 0; index < ids_cars.length; index++) {
      const ownerCar = await Car.findOne({ _id: ids_cars[index] });
      ownerCar && carsOwner.push(ownerCar);
      const saledCar = await Car.findOne({
        _id: ids_cars[index],
        is_saled: true,
      });
      saledCar && carsSaled.push(saledCar);
      const ReservedCars = await ReserveCars.findOne({
        id_owner: _id,
        id_car: ids_cars[index],
      });
      ReservedCars && carsReserved.push(ReservedCars._id);
    }
    ///
    const allReservedCar = await ReserveCars.find();
    if (allReservedCar) {
      const proposedReduction = allReservedCar.filter(
        (car) => car.proposed_reduction > 0
      );
      proposedReduction.map((car) => {
        ids_reserverdCarWithReduction.push(car.id_car);
      });
      for (
        let index = 0;
        index < ids_reserverdCarWithReduction.length;
        index++
      ) {
        const reserverCarWithReduction = await Car.findOne({
          _id: ids_reserverdCarWithReduction[index],
          is_saled: false,
        });
        reserverCarWithReduction &&
          allReserverdCarWithReduction.push(reserverCarWithReduction);
      }
      console.log(allReserverdCarWithReduction);
    }
    return {
      ownerCars: carsOwner,
      reserveCars: carsSaled,
      reserveCarReduction: allReserverdCarWithReduction,
    };
  }
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
