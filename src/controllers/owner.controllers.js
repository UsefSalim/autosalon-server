/* eslint-disable no-underscore-dangle */
const { carValidations } = require('../validations/car.validations');
const { profileRequests, addCarsRequests } = require('../utils/owner.requests');
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
    const { ownerCars, reserveCars } = await profileRequests(Owner);
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

/// a refactoré
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
