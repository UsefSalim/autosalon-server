const Joi = require('joi');

exports.ownerRegisterValidations = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().required().min(3).max(24).trim(),
    last_name: Joi.string().required().min(3).max(24).trim(),
    password: Joi.string().required().min(6).max(1024),
    cin: Joi.string().required().min(7).max(8).trim(),
    email: Joi.string().email().required(),
    phone: Joi.string().required().min(10).max(10).trim(),
    rib: Joi.string().required().min(24).max(24).trim(),
    role: Joi.string().valid('Client', 'Owner'),
  });

  return schema.validate(data);
};
exports.clientRegisterValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().required().min(3).max(24).trim(),
    last_name: Joi.string().required().min(3).max(24).trim(),
    password: Joi.string().required().min(6).max(1024),
    cin: Joi.string().required().min(7).max(8).trim(),
    email: Joi.string().email().required(),
    phone: Joi.string().required().min(10).max(10).trim(),
    role: Joi.string().valid('Client', 'Owner'),
  });

  return schema.validate(data);
};
exports.LoginValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().required().min(6).max(1024),
    email: Joi.string().email().required(),
    role: Joi.string().valid('Client', 'Owner'),
  });

  return schema.validate(data);
};
