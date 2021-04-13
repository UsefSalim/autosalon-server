/* eslint-disable no-underscore-dangle */
const { carValidations } = require('../validations/car.validations');
const { profileRequests, addCarsRequests } = require('../utils/owner.requests');
const { findIdOwnerFromIdCar } = require('../utils/client.requests');
const ReserveCar = require('../models/reserve_car.model');
const Fawn = require('fawn');
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
    const {
      ownerCars,
      reserveCars,
      reserveCarReduction,
    } = await profileRequests(Owner);
    res.status(200).json({
      Owner,
      ownerCars,
      reserveCars,
      reserveCarReduction,
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

// @TODO a refactoré  verification if matricule existe
exports.ownerAddCar = async (req, res) => {
  const Owner = res.currentUser;
  const { error } = carValidations(req.body);
  if (error)
    return res
      .status(400)
      .json({ ErrorValidationsAddCar: error.details[0].message });
  try {
    const {
      createCarAndOwnerCarAndUpdateDisponibility,
      ownerCars,
    } = await addCarsRequests(Owner, req);
    if (createCarAndOwnerCarAndUpdateDisponibility)
      res.status(201).json(ownerCars);
  } catch (error) {
    res.status(500).json({ errorAddCar: error });
  }
};

exports.tretementOffreAccepted = async (req, res) => {
  const id_car = req.body.id;
  const task = Fawn.Task();
  try {
    const { id_place } = await findIdOwnerFromIdCar(id_car);
    const savereservCarAndUpdateCar = await task
      .update('Car', { _id: id_car }, { $set: { is_saled: true } })
      .update('Place', { _id: id_place }, { $set: { is_free: true } })
      .update(
        'Reservecar',
        { id_car },
        { $set: { proposed_reduction: 0, is_accepted: true } }
      )
      .run({ useMongoose: true });
    if (savereservCarAndUpdateCar)
      return res.status(200).json('Car Reserved avecSuccess');
  } catch (error) {
    return res.status(500).json({ errorOwnerValidation: error });
  }
};
exports.tretementOffreRefusd = async (req, res) => {
  const id_owner = res.currentUser._id;
  const id_car = req.body.id;
  // const { id_place } = await findIdOwnerFromIdCar(id_car);
  try {
    const reservedCar = await ReserveCar.findOne({ id_car, id_owner });
    if (reservedCar) {
      reservedCar.proposed_reduction = 0;
      reservedCar.is_accepted = false;
      const reservedCarSave = await reservedCar.save();
      if (reservedCarSave)
        return res.status(200).json('Car Refused avecSuccess');
    }
  } catch (error) {
    return res.status(500).json({ errorOwnerValidation: error });
  }
};
