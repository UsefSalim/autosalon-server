const express = require('express');

const router = express.Router();
const {
  clientProfileController,
} = require('../controllers/client.controllers');

const { clientMiddleware, auth } = require('../middlewares/auth.middlewares');

router.get('/', clientMiddleware, auth, clientProfileController);

module.exports = router;
