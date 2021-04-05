//! require dependencies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//! require Client and Owner Model
const Owner = require('../models/owner.model')
const Client = require('../models/client.model')
//! require validations
const { clientRegisterValidation, ownerRegisterValidations, LoginValidation } = require('../validations/auth.validations')

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
 */
exports.registreController = (req, res) =>
{
  req.body.rib ? registerOwner(req, res) : registerClient(req, res)
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @root : https://localhost:5000/api/auth/login
 * @desc: login client and owner 
 */
exports.loginController = (req, res) =>
{
  req.body.role === "Client" ? loginClient(req, res) : loginOwner(req, res)
}




const registerClient = async (req, res) =>
{
  // validations de la data 
  const { error } = clientRegisterValidation(req.body)
  if (error)
    return res.status(400).json({ ErrorClientRegister: error.details[0].message })
  try
  {
    // verification if client exist 
    const clientExist = await Client.findOne({ email: req.body.email })
    if (clientExist)
      return res.status(400).json({ ErrorMailClientExist: "compte existant veiller vous connecter" })
    // create a new client
    const newClient = new Client({ ...req.body })
    newClient.password = await bcrypt.hash(
      req.body.password,
      await bcrypt.genSalt(10)
    );
    const savedClient = await newClient.save()
    if (savedClient)
      return res.status(201).json("User Created Succesfuly")
  } catch (error)
  {
    return res.status(500).json({ CatchedError: error })
  }

}

const registerOwner = async (req, res) =>
{
  // validations de la data 
  const { error } = ownerRegisterValidations(req.body)
  if (error)
    return res.status(400).json({ ErrorOwnerRegister: error.details[0].message })
  try
  {
    // verification if owner exist 
    const ownerExist = await Owner.findOne({ email: req.body.email })
    if (ownerExist)
      return res.status(400).json({ ErrorMailOwnerExist: "compte existant veiller vous connecter" })
    // create a new owner
    const newOwner = new Owner({ ...req.body })
    console.log(newOwner);
    newOwner.password = await bcrypt.hash(
      req.body.password,
      await bcrypt.genSalt(10)
    );

    const savedOwner = await newOwner.save()
    if (savedOwner)
      return res.status(201).json("Owner Created Succesfuly")
  } catch (error)
  {
    return res.status(500).json({ CatchedError: error })
  }

}


const loginClient = async (req, res) =>
{
  const { error } = LoginValidation(req.body)
  if (error)
    return res.status(400).json({ ErrorClientLogin: error.details[0].message })
  const clientExist = await Client.findOne({ email: req.body.email })
  if (
    !clientExist ||
    !(await bcrypt.compare(req.body.password, clientExist.password))
  )
    return res.status(400).json({ ErrorClientLogin: 'mail ou password incorrect' });
  const token = createToken({ id: clientExist._id, role: "Client" });
  res.cookie('clientLogToken', token, {
    httpOnly: true,
    maxAge: process.env.JWT_EXPIRATION_TIME,
  }).json({ SucessLoginClient: "user Loged Succesfully" })
}

const loginOwner = async (req, res) =>
{
  const { error } = LoginValidation(req.body)
  if (error)
    return res.status(400).json({ ErrorOwnerLogin: error.details[0].message })
  const ownerExist = await Owner.findOne({ email: req.body.email })
  if (
    !ownerExist ||
    !(await bcrypt.compare(req.body.password, ownerExist.password))
  )
    return res.status(400).json({ ErrorOwnerLogin: 'mail ou password incorrect' });
  const token = createToken({ id: ownerExist._id, role: "Owner" });
  res.cookie('ownerLogToken', token, {
    httpOnly: true,
    maxAge: process.env.JWT_EXPIRATION_TIME,
  }).json({ SucessLoginClient: "owner Loged Succesfully" })
}
