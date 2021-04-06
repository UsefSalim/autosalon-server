/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const Fawn = require('fawn');
const TryCar = require('../models/try_car.model');
const Car = require('../models/car.model');
const OwnerCar = require('../models/owner_car.model');
const ReserveCar = require('../models/reserve_car.model');
const Owner = require('../models/owner.model');
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
    const allCars = await Car.find({ is_saled: false });
    res.status(200).json({ currentClient, allCars });
  } catch (error) {}
};

exports.esseyVoiture = async (req, res) => {
  const task = Fawn.Task();
  const id_client = res.currentUser._id;
  const id_car = req.params.idcar;
  /// restriction apré 10 essey
  if (res.currentUser == 10)
    return res
      .status(400)
      .json({ ErrorEssyCar: "Vous avez depasser le nombre d'essey " });
  try {
    const currentCar = await Car.findOne({ _id: id_car });
    if (!currentCar)
      return res.status(400).json({
        ErrorFindCar: "La voiture que vous souhaiter esseyé n'existe pas",
      });
    const ifCarEsseyed = await TryCar.findOne({ id_car, id_client });
    if (ifCarEsseyed)
      return res.status(400).json({
        ErrorEsseyCar: "Vous avez le doit d'un seul essey par voiture",
      });
    const newTryCar = new TryCar({
      id_car,
      id_client,
    });
    const newGlobalTries = res.currentUser.global_tries + 1;
    const saveTryCarAndUpdateClient = await task
      .save('trycar', newTryCar)
      .update(
        'client',
        { _id: id_client },
        { $set: { global_tries: newGlobalTries } }
      )
      .run({ useMongoose: true });
    if (saveTryCarAndUpdateClient)
      return res.status(201).json({ TryCar: 'Success' });
  } catch (error) {
    return res.status(500).json({ TryCarError: error });
  }
};
const reservationRequest = async (id_car) => {
  const { id_owner } = await OwnerCar.findOne({ id_car }).select(
    'id_owner -_id'
  );
  if (id_owner)
    return {
      infoCar: await Car.findOne({ _id: id_car }),
      infoOwner: await Owner.findOne({ _id: id_owner }).select('-password'),
    };
};
exports.reservationCarInfo = async (req, res) => {
  const currentClient = res.currentUser;
  const id_car = req.params.idcar;
  try {
    const { infoCar, infoOwner } = await reservationRequest(id_car);
    if (infoCar && infoOwner)
      return res.status(200).json({ infoCar, infoOwner, currentClient });
  } catch (error) {
    return res.status(500).json({ reserverCar: error });
  }
};

// exports.reservationCar = async (req, res) => {
//   const currentClient = res.currentUser;
//   const id_car = req.params.idcar;
//   try {
//     const { id_owner } = await OwnerCar.findOne({ id_car }).select(
//       'id_owner -_id'
//     );
//     if (req.body.proposed_reduction) {

//     }
//   } catch (error) {}

//   // const id_car = req.params.idcar;
//   // try {
//   // } catch (error) {}
// };

/// recuperer l'id owwner
// const { id_owner } = await OwnerCar.findOne({ id_car }).select(
//   'id_owner -_id'
// );

// if (id_owner) {
//   const newReserveCar = new ReserveCar({
//     id_car,
//     id_client,
//     id_owner,
//   });
//   // const saveReserveCar = await newReserveCar.save();
//   // if(saveReserveCar)
//   const saveReserveCarAndUpdateCar

// }
