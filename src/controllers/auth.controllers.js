//! require dependencies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//! require Client and Owner Model
const Owner = require('../models/owner.model');
const Client = require('../models/client.model');
//! require validations
const {
  clientRegisterValidation,
  ownerRegisterValidations,
  LoginValidation,
} = require('../validations/auth.validations');

// function create a token with jwt
const createToken = (data) =>
  jwt.sign({ data }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });

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

// register client
const registerClient = async (req, res) => {
  // validations de la data
  const { error } = clientRegisterValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ ErrorClientRegister: error.details[0].message });
  try {
    // verification if client exist
    const clientExist = await Client.findOne({ email: req.body.email });
    if (clientExist)
      return res.status(400).json({
        ErrorMailClientExist: 'compte existant veiller vous connecter',
      });
    // create a new client
    const newClient = new Client({ ...req.body });
    newClient.password = await bcrypt.hash(
      req.body.password,
      await bcrypt.genSalt(10)
    );
    const savedClient = await newClient.save();
    if (savedClient) return res.status(201).json('User Created Succesfuly');
  } catch (error) {
    return res.status(500).json({ CatchedError: error });
  }
};
// register owner
const registerOwner = async (req, res) => {
  // validations de la data
  const { error } = ownerRegisterValidations(req.body);
  if (error)
    return res
      .status(400)
      .json({ ErrorOwnerRegister: error.details[0].message });
  try {
    // verification if owner exist
    const ownerExist = await Owner.findOne({ email: req.body.email });
    if (ownerExist)
      return res.status(400).json({
        ErrorMailOwnerExist: 'compte existant veiller vous connecter',
      });
    // create a new owner
    const newOwner = new Owner({ ...req.body });
    newOwner.password = await bcrypt.hash(
      req.body.password,
      await bcrypt.genSalt(10)
    );

    const savedOwner = await newOwner.save();
    if (savedOwner) return res.status(201).json('Owner Created Succesfuly');
  } catch (error) {
    return res.status(500).json({ CatchedError: error });
  }
};
// login client
const loginClient = async (req, res) => {
  // gestion des erreur de validation
  const { error } = LoginValidation(req.body);
  if (error)
    return res.status(400).json({ ErrorClientLogin: error.details[0].message });
  // verrifier si le mail est deja existant dans la bas de donné
  const clientExist = await Client.findOne({ email: req.body.email });
  if (
    !clientExist ||
    !(await bcrypt.compare(req.body.password, clientExist.password))
  )
    // si le mail est pas existant ou le mots de pass ne match pas avec le hash
    return res
      .status(400)
      .json({ ErrorClientLogin: 'mail ou password incorrect' });
  // Clreation du token avec id et role
  // eslint-disable-next-line no-underscore-dangle
  const token = createToken({ id: clientExist._id, role: 'Client' });
  res
    .cookie('clientLogToken', token, {
      httpOnly: true,
      maxAge: process.env.JWT_EXPIRATION_TIME,
    })
    .json({ SucessLoginClient: 'user Loged Succesfully' });
};

// login owner
const loginOwner = async (req, res) => {
  const { error } = LoginValidation(req.body);
  if (error)
    return res.status(400).json({ ErrorOwnerLogin: error.details[0].message });
  const ownerExist = await Owner.findOne({ email: req.body.email });
  if (
    !ownerExist ||
    !(await bcrypt.compare(req.body.password, ownerExist.password))
  )
    return res
      .status(400)
      .json({ ErrorOwnerLogin: 'mail ou password incorrect' });
  // eslint-disable-next-line no-underscore-dangle
  const token = createToken({ id: ownerExist._id, role: 'Owner' });
  res
    .cookie('ownerLogToken', token, {
      httpOnly: true,
      maxAge: process.env.JWT_EXPIRATION_TIME,
    })
    .json({ SucessLoginClient: 'owner Loged Succesfully' });
};
