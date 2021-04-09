/* eslint-disable no-return-await */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//! require Client and Owner Model
const Owner = require('../models/owner.model');
const Client = require('../models/client.model');
const {
  clientRegisterValidation,
  ownerRegisterValidations,
  LoginValidation,
} = require('../validations/auth.validations');

exports.createUser = async (req, Model) => {
  const newUser = new Model({ ...req.body });
  newUser.password = await bcrypt.hash(
    req.body.password,
    await bcrypt.genSalt(10)
  );
  return await newUser.save();
};
exports.ifUserExist = async (req, Model) =>
  await Model.findOne({ email: req.body.email });

exports.createToken = (data) =>
  jwt.sign({ data }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
exports.register = async (req, res, validations, Model, Role) => {
  // validations de la data
  const { error } = validations(req.body);
  if (error)
    return res.status(400).json({ ErrorRegister: error.details[0].message });
  try {
    if (await this.ifUserExist(req, Model))
      return res
        .status(400)
        .json(
          `Compte avec l'adress mail ${req.body.email} déja existant veiller vous connecter`
        );
    if (await this.createUser(req, Model)) return res.status(201).json(Role);
  } catch (error) {
    return res.status(500).json(error);
  }
};
// login client
exports.loginClient = async (req, res) => {
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
  const token = this.createToken({ id: clientExist._id, role: 'Client' });
  res
    .cookie('clientLogToken', token, {
      httpOnly: true,
      maxAge: process.env.JWT_EXPIRATION_TIME,
    })
    .json('Client');
};

// login owner
exports.loginOwner = async (req, res) => {
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
  const token = this.createToken({ id: ownerExist._id, role: 'Owner' });
  res
    .cookie('ownerLogToken', token, {
      httpOnly: true,
      maxAge: process.env.JWT_EXPIRATION_TIME,
    })
    .json('Owner');
};
