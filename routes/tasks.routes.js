const express = require('express');
const taskRoutes = express.Router();

const mw = require('../middlewares/main.mw');
const {validate, _404, role, webAuth} = mw.one;

taskRoutes.use(mw.global);

const taskController = require('../modules/tasks/task.controller');
const taskValidator = require('../validators/task.validator');
const { rolesPermission } = require('../constants/common.const');

taskRoutes.post('/add', webAuth, role(2), validate(taskValidator.add), taskController.add)
taskRoutes.put('/update', webAuth, role(2), validate(taskValidator.update), taskController.update)
taskRoutes.post('/delete', webAuth, role(1), validate(taskValidator.delete), taskController.delete)
taskRoutes.post('/move', webAuth, role(3),validate(taskValidator.move),taskController.move)
taskRoutes.get('/get/:taskId', webAuth, role(3),validate(taskValidator.get), taskController.getTaskDetails)
taskRoutes.get('/getList', webAuth, role(3),taskController.getAllList)
taskRoutes.get('/kanban', webAuth, role(3),taskController.kanbanTask)
taskRoutes.get('/listProjects', webAuth, role(3),taskController.listActiveProjects)
taskRoutes.post('/assignTask', webAuth, role(3), validate(taskValidator.assignTask), taskController.assignTask)

taskRoutes.use('**', _404);
module.exports = taskRoutes;