const express = require('express');

const router = express.Router();
const {
  clientProfileController,
  esseyVoiture,
  // reservationCar,
  reservationCarInfo,
} = require('../controllers/client.controllers');

const { clientMiddleware, auth } = require('../middlewares/auth.middlewares');

router.get('/', clientMiddleware, auth, clientProfileController);
router.get('/trycar/:idcar', clientMiddleware, auth, esseyVoiture);
router.get('/reservecar/:idcar', clientMiddleware, auth, reservationCarInfo);
// router.post('/reservecar/:idcar', clientMiddleware, auth, reservationCar);

module.exports = router;
