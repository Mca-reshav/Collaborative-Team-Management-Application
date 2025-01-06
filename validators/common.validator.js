const Joi = require("joi");
const {
  genderType,} = require("../constants/models.const");

module.exports = {
  login: Joi.object({
    emailId: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  register: Joi.object({
    name: Joi.string().min(3).required(),
    emailId: Joi.string().email().required(),
    contactNo: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid Contact Number.',
    }),
    password: Joi.string().min(8).max(20).required(),
    gender: Joi.string()
      .valid(...Object.keys(genderType))
      .required(),
    dateOfBirth: Joi.date().required()
  })
};
