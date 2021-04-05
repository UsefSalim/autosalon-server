const express = require('express');

const router = express.Router();
const { registreController } = require('../controllers/auth.controllers')


router.post('/register', registreController)

module.exports = router;
