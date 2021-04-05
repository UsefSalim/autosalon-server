const express = require('express');

const router = express.Router();
const {
  ownerProfileController,
  ownerAddCar,
} = require('../controllers/owner.controllers');
const { ownerMiddleware, auth } = require('../middlewares/auth.middlewares');

router.get('/', ownerMiddleware, auth, ownerProfileController);
router.post('/createcar', ownerMiddleware, auth, ownerAddCar);

module.exports = router;
