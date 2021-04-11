/* eslint-disable no-lonely-if */
const jwt = require('jsonwebtoken');
const Owner = require('../models/owner.model');
const Client = require('../models/client.model');

exports.clientMiddleware = (req, res, next) => {
  res.Role = 'Client';
  res.Model = Client;
  next();
};
exports.ownerMiddleware = (req, res, next) => {
  res.Role = 'Owner';
  res.Model = Owner;
  next();
};
exports.auth = async (req, res, next) => {
  // const Model = res.role;
  // console.log(Model);
  const token = req.cookies.OwnerLogToken || req.cookies.ClientLogToken;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        decodedToken.data.role === 'Client'
          ? res
              .clearCookie('ClientLogToken')
              .json(`private root need ${res.Role} login`)
          : res
              .clearCookie('OwnerLogToken')
              .json(`private root need ${res.Role} login`);
      } else {
        res.currentUser = await res.Model.findOne({
          _id: decodedToken.data.id,
        }).select('-password');
        next();
      }
    });
  } else {
    return res.status(400).json(`private root need ${res.Role} login`);
  }
};

exports.verifIsAuthenticated = (req, res, next) => {
  const token = req.cookies.OwnerLogToken || req.cookies.ClientLogToken;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        decodedToken.data.role === 'Client'
          ? res
              .clearCookie('ClientLogToken')
              .json({ role: '', isAuthenticated: false })
          : res
              .clearCookie('OwnerLogToken')
              .json({ role: '', isAuthenticated: false });
      } else {
        // console.log(object);
        decodedToken.data.role === 'Client'
          ? res.status(200).json({ role: 'Client', isAuthenticated: true })
          : res.status(200).json({ role: 'Owner', isAuthenticated: true });
      }
    });
  } else {
    res.json({ role: '', isAuthenticated: false });
  }
};
