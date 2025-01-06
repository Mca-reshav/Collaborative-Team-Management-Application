const Joi = require('joi');
const { projectTypes } = require('../constants/models.const');

module.exports = {
    create: Joi.object({
        projectTitle: Joi.string().required(), 
        projectDescription: Joi.string().required(),
        members: Joi.array().items(
            Joi.string()
              .pattern(/^[A-Za-z0-9+/=]+$/)
              .messages({
                "string.pattern.base": "Invalid member ID format.",
              })
          )
          .required()
          .messages({
            "array.base": "Members must be an array.",
            "array.includes": "All members must be valid base64 strings.",
          })
    }),
    update: Joi.object({
      projectTitle: Joi.string().optional(),
      projectDescription: Joi.string().optional(),
      projectStatus: Joi.string().valid(...Object.keys(projectTypes)).allow(false).optional(),
      remark: Joi.string().allow('').optional(),
      projectId: Joi.string().required()
    }),
    delete: Joi.object({
      projectId: Joi.string().required(),
      remark: Joi.string().allow('').optional(),
    }),
    projectIdWise: Joi.object({
      projectId: Joi.string().required()
    })
}