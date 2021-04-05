const jwt = require('jsonwebtoken');
const Owner = require('../models/owner.model');
const Client = require('../models/client.model');

exports.clientMiddleware = (req, res, next) => {
  res.Role = 'Client';
  next();
};
exports.ownerMiddleware = (req, res, next) => {
  res.Role = 'Owner';
  next();
};
exports.auth = async (req, res, next) => {
  const token = req.cookies.ownerLogToken || req.cookies.clientLogToken;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (!err && decodedToken.data.role === res.Role) {
        if (decodedToken.data.role === 'Client') {
          res.currentUser = await Client.findOne({
            _id: decodedToken.data.id,
          }).select('-password');
        } else {
          res.currentUser = await Owner.findOne({
            _id: decodedToken.data.id,
          }).select('-password');
        }
        next();
      } else {
        res.cookie('token', '', { maxAge: 1 });
        return res.status(401).json(`private root need ${res.Role} login`);
      }
    });
  } else {
    res.cookie('token', '', { maxAge: 1 });
    return res.status(400).json(`private root need ${res.Role} login`);
  }
};
