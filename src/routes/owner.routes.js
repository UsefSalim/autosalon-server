const express = require('express');

const router = express.Router();
const {
  ownerProfileController,
  ownerAddCar,
  tretementOffreAccepted,
  tretementOffreRefusd,
} = require('../controllers/owner.controllers');
const { ownerMiddleware, auth } = require('../middlewares/auth.middlewares');

router.get('/', ownerMiddleware, auth, ownerProfileController);
router.post('/createcar', ownerMiddleware, auth, ownerAddCar);
router.post(
  '/tretementoffreaccepted',
  ownerMiddleware,
  auth,
  tretementOffreAccepted
);
router.post(
  '/tretementoffrerefusd',
  ownerMiddleware,
  auth,
  tretementOffreRefusd
);

module.exports = router;
