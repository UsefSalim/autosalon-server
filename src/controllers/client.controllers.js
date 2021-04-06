/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

/// Requests
const {
  reservationRequest,
  findAll,
  esseyVoitureRequest,
  reserverdCarWithReduction,
  reservationwithoutReduction,
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
    const allCars = await findAll(false);
    if (allCars) return res.status(200).json({ currentClient, allCars });
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
  const id_client = res.currentUser._id;
  const id_car = req.params.idcar;
  const newGlobalTries = res.currentUser.global_tries + 1;
  if (res.currentUser.global_tries == 10)
    return res
      .status(400)
      .json({ ErrorEssyCar: "Vous avez depasser le nombre d'essey " });
  try {
    const {
      currentCar,
      ifCarEsseyed,
      saveTryCarAndUpdateClient,
    } = await esseyVoitureRequest(id_client, id_car, newGlobalTries);
    if (!currentCar)
      return res.status(400).json({
        ErrorFindCar: "La voiture que vous souhaiter esseyé n'existe pas",
      });
    if (ifCarEsseyed)
      return res.status(400).json({
        ErrorEsseyCar: "Vous avez le doit d'un seul essey par voiture",
      });
    if (saveTryCarAndUpdateClient)
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
    proposed_reduction
      ? reserverdCarWithReduction(id_car, id_client, proposed_reduction, res)
      : reservationwithoutReduction(id_car, id_client, res);
  } catch (error) {
    return res.status(500).json({ ErrorValidateReservation: error });
  }
};
