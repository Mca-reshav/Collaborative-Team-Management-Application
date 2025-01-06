const Joi = require('joi');
const { priorityType, statusType } = require('../constants/models.const');

module.exports = {
    add: Joi.object({
        projectId: Joi.string().required(),
        taskTitle: Joi.string().required(),
        taskDesc: Joi.string().default('').required(),
        dueDate: Joi.string().required(),
        priority: Joi.string().valid(...Object.keys(priorityType)).required()
    }),
    delete: Joi.object({
        taskId: Joi.string().required(),
        remark: Joi.string().required()
    }),
    update: Joi.object({ 
        taskId: Joi.string().required(),
        taskTitle: Joi.string().optional(),
        taskDescription: Joi.string().default('').optional(),
        dueDate: Joi.string().optional(),
        priority: Joi.string().valid(...Object.keys(priorityType)).optional(),
        taskStatus: Joi.string().valid(...Object.keys(statusType)).optional(),
        remark: Joi.string().required()
    }),
    get: Joi.object({
        taskId: Joi.string().required()
    }), 
    move: Joi.object({
        taskId: Joi.string().required(),
        taskStatus: Joi.string().valid('1','2').required(),
    }),
    assignTask: Joi.object({
        taskId: Joi.string().required(),
        userId: Joi.string().required(),
    })

};