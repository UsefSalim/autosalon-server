const { register, loginClient, loginOwner } = require('../utils/auth.requests');
const {
  clientRegisterValidation,
  ownerRegisterValidations,
} = require('../validations/auth.validations');
const Owner = require('../models/owner.model');
const Client = require('../models/client.model');
/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/auth/register
 * @desc: register client and owner
 * @method : POST
 */
exports.registreController = (req, res) => {
  !req.body.role
    ? register(req, res, clientRegisterValidation, Client, 'Client')
    : register(req, res, ownerRegisterValidations, Owner, 'Owner');
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/auth/login
 * @desc: login client and owner
 * @method : POST
 */
exports.loginController = (req, res) => {
  !req.body.role ? loginClient(req, res) : loginOwner(req, res);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/auth/logout
 * @desc: logout client and owner
 * @method : GET
 */
exports.logoutController = (req, res) => {
  req.cookies.ClientLogToken
    ? res
        .clearCookie('ClientLogToken')
        .json({ role: '', isAuthenticated: false })
    : res
        .clearCookie('OwnerLogToken')
        .json({ role: '', isAuthenticated: false });
};
