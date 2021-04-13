/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

/// Requests
const {
  reservationRequest,
  profileClient,
  esseyVoitureRequest,
  reserverdCarWithReduction,
  reservationwithoutReduction,
  getCurrentCar,
  ifCarEsseyed,
} = require('../utils/client.requests');
/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/client
 * @desc: profile Client
 * @method : GET
 * @type : Private
 */

exports.clientProfileController = async (req, res) => {
  const currentClient = res.currentUser;
  try {
    const {
      reserverdCar,
      allCars,
      reservedCarWithreduction,
    } = await profileClient(currentClient);
    if (reserverdCar && allCars && reservedCarWithreduction)
      return res.status(200).json({
        allCars,
        currentClient,
        reservedCarWithreduction,
        reserverdCar,
      });
  } catch (error) {
    return res.status(500).json({ ProfileClient: error });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/client/trycar/:idcar
 * @desc: essey car
 * @method : GET
 * @type : Private
 */
exports.esseyVoiture = async (req, res) => {
  const { _id, global_tries } = res.currentUser;
  const id_car = req.params.idcar;
  // global tries a updaté dans la request
  if (res.currentUser.global_tries >= 10)
    return res.status(400).json("Vous avez depasser le nombre d'essey");
  try {
    const carExiste = await getCurrentCar(id_car);
    if (!carExiste)
      return res.status(400).json({
        ErrorFindCar: "La voiture que vous souhaiter esseyé n'existe pas",
      });
    const carEsseyed = await ifCarEsseyed(id_car, _id);
    if (carEsseyed)
      return res
        .status(400)
        .json("Vous avez le doit d'un seul essey par voiture");
    const createCarAndUpdateClientTries = await esseyVoitureRequest(
      _id,
      id_car,
      global_tries
    );
    if (createCarAndUpdateClientTries)
      return res.status(201).json({ TryCar: 'Success' });
  } catch (error) {
    return res.status(500).json({ TryCarError: error });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/client/reservecar/:idcar
 * @desc:  info reservation Car
 * @method : GET
 * @type : Private
 */
exports.reservationCarInfo = async (req, res) => {
  const currentClient = res.currentUser;
  const id_car = req.params.idcar;
  try {
    const { infoCar, infoOwner } = await reservationRequest(id_car);
    if (infoCar && infoOwner)
      return res.status(200).json({ infoCar, infoOwner, currentClient });
  } catch (error) {
    return res.status(500).json({ ErrorReserverCar: error });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/client/reservecar/:idcar
 * @desc: valider la reservation avec ou sans remise
 * @method : GET
 * @type : Private
 */
exports.reservationCar = async (req, res) => {
  const id_client = res.currentUser._id;
  const id_car = req.params.idcar;
  const { proposed_reduction } = req.body;
  try {
    const currentCar = await getCurrentCar(id_car);
    if (!currentCar)
      return res.status(400).json({
        ErrorFindCar: "La voiture que vous souhaiter esseyé n'existe pas",
      });
    // console.log(req.body);
    proposed_reduction
      ? reserverdCarWithReduction(id_car, id_client, proposed_reduction, res)
      : reservationwithoutReduction(id_car, id_client, res);
  } catch (error) {
    return res.status(500).json({ ErrorValidateReservation: error });
  }
};
