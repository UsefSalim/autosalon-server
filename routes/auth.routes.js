const express = require('express');

const router = express.Router();
const { registreController, loginController } = require('../controllers/auth.controllers')


router.post('/register', registreController)
router.post('/login', loginController)

module.exports = router;
