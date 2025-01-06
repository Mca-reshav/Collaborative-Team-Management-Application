const Joi = require("joi");
const { isAssigned, genderType, designationType, roleType, userStatus } = require("../constants/models.const");

module.exports = {
  assign: Joi.object({
    empId: Joi.string().required(),
  }),
  update: Joi.object({
    empId: Joi.string().required(),
    name: Joi.string().min(3).required(),
    emailId: Joi.string().email().required(),
    contactNo: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Invalid Contact Number.",
      }),
    gender: Joi.string()
      .valid(...Object.keys(genderType))
      .required(),
    dateOfBirth: Joi.date().required(),
    designation: Joi.string()
      .valid(...Object.keys(designationType))
      .required(),
    status: Joi.string().valid(...Object.keys(userStatus)).required(),
    role: Joi.string()
      .valid(...Object.keys(roleType))
      .required(),
    isAssigned: Joi.string().valid(...Object.keys(isAssigned)).required()
  }),
  toggleStatus: Joi.object({
    empId: Joi.string().required(),
  }),
  list: Joi.object({
    empId: Joi.string().required(),
  }),
};
