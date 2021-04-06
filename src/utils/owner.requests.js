const Fawn = require('fawn');
const Car = require('../models/car.model');
const OwnerCar = require('../models/owner_car.model');
const ReserveCars = require('../models/reserve_car.model');
const Place = require('../models/place.model');

exports.profileRequests = async ({ _id }) => ({
  ownerCars: await OwnerCar.find({ id_owner: _id }),
  reserveCars: await ReserveCars.find({ id_owner: _id }),
});

exports.addCarsRequests = async (Owner) => {
  const task = Fawn.Task();
  const newCar = new Car({ ...req.body });
  const placeDispo = await Place.findOne({ is_free: true });
  const createOwnerCar = new OwnerCar({
    id_owner: Owner._id,
    id_place: placeDispo._id,
    id_car: newCar._id,
  });
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
  return {
    placeDispo,
    createCarAndOwnerCarAndUpdateDisponibility,
  };
};
