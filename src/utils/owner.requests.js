/* eslint-disable no-underscore-dangle */
const Fawn = require('fawn');
const Car = require('../models/car.model');
const OwnerCar = require('../models/owner_car.model');
const ReserveCars = require('../models/reserve_car.model');
const Place = require('../models/place.model');

exports.profileRequests = async ({ _id }) => {
  const ownerCars = await OwnerCar.find({ id_owner: _id });
  const ids_cars = [];
  const carsOwner = [];
  if (ownerCars) {
    ownerCars.map((car) => {
      ids_cars.push(car.id_car);
    });
    for (let index = 0; index < ids_cars.length; index++) {
      carsOwner.push(await Car.findOne({ _id: ids_cars[index] }));
    }

    return {
      ownerCars: carsOwner,
      reserveCars: await ReserveCars.find({ id_owner: _id }),
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