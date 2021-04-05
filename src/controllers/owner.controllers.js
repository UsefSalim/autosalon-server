/* eslint-disable no-underscore-dangle */
const Fawn = require('fawn');
const Car = require('../models/car.model');
const OwnerCar = require('../models/owner_car.model');
const ReserveCars = require('../models/reserve_car.model');
const Place = require('../models/place.model');

const { carValidations } = require('../validations/car.validations');
/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/owner
 * @desc: profile owner
 * @method : GET
 * @type : Private
 */

exports.ownerProfileController = async (req, res) => {
  try {
    const Owner = res.currentUser;
    const ownerCars = await OwnerCar.find({ id_owner: Owner._id });
    const reserveCars = await ReserveCars.find({ id_owner: Owner._id });
    res.status(200).json({
      Owner,
      ownerCars,
      reserveCars,
    });
  } catch (error) {
    res.status(500).json({ ownerProfileErrorCatched: error });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/owner *** Pop Up ****
 * @desc: profile owner
 * @method : POST
 * @type : Private
 */
exports.ownerAddCar = async (req, res) => {
  const Owner = res.currentUser;
  const { error } = carValidations(req.body);
  if (error)
    return res
      .status(400)
      .json({ ErrorValidationsAddCar: error.details[0].message });
  try {
    const placeDispo = await Place.findOne({ is_free: true });
    const newCar = new Car({ ...req.body });
    const createOwnerCar = new OwnerCar({
      id_owner: Owner._id,
      id_place: placeDispo._id,
      id_car: newCar._id,
    });
    const task = Fawn.Task();
    if (placeDispo) {
      const createCarAndOwnerCar = await task
        .save('car', newCar)
        .save('ownercar', createOwnerCar)
        .run({ useMongoose: true });
      if (createCarAndOwnerCar)
        res
          .status(201)
          .json({ creationCarValidation: 'car created succesfully' });
    }
  } catch (error) {
    res.status(500).json({ errorAddCar: error });
  }
};
