const express = require('express');

const router = express.Router();
const {
  registreController,
  loginController,
  logoutController,
} = require('../controllers/auth.controllers');

router.post('/register', registreController);
router.post('/login', loginController);
router.get('/logout', logoutController);

module.exports = router;
