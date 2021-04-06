const {
  registerOwner,
  registerClient,
  loginClient,
  loginOwner,
} = require('../utils/auth.requests');
/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/auth/register
 * @desc: register client and owner
 * @method : POST
 */
exports.registreController = (req, res) => {
  req.body.rib ? registerOwner(req, res) : registerClient(req, res);
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
  req.body.role === 'Client' ? loginClient(req, res) : loginOwner(req, res);
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
  req.cookies.clientLogToken
    ? res.clearCookie('clientLogToken').json('Logout Client 👍')
    : res.clearCookie('ownerLogToken').json('Logout Owner 👌');
};
