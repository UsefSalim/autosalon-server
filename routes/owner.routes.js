const express = require('express');

const router = express.Router();
const { ownerProfileController } = require('../controllers/owner.controllers');
const { ownerMiddleware, auth } = require('../middlewares/auth.middlewares');

router.get('/', ownerMiddleware, auth, ownerProfileController);

module.exports = router;
