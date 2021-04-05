const Joi = require('joi');

exports.carValidations = (data) => {
  const schema = Joi.object({
    registration_number: Joi.string().required().min(3).trim(),
    name: Joi.string().required().min(3).trim(),
    mark: Joi.string().required().min(1).trim(),
    color: Joi.string().required().min(3).trim(),
    fuel: Joi.string().required().valid('Diesel', 'Gasoil'),
    price: Joi.string().required().min(3).trim(),
  });

  return schema.validate(data);
};
