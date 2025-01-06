const express = require('express');
const projectRoutes = express.Router();

const mw = require('../middlewares/main.mw');
const {validate, _404, role, webAuth} = mw.one;

projectRoutes.use(mw.global);

const projectController = require('../modules/projects/project.controller');
const projectValidator = require('../validators/project.validator');

projectRoutes.post('/add', webAuth, role(2) ,validate(projectValidator.create), projectController.createProject);
projectRoutes.post('/delete', webAuth, role(1), validate(projectValidator.delete), projectController.deleteProject);
projectRoutes.put('/update', webAuth, role(2),validate(projectValidator.update), projectController.updateProject)
projectRoutes.get('/get/:projectId', webAuth, role(3), validate(projectValidator.projectIdWise),projectController.listProject)
projectRoutes.get('/getList', webAuth, role(3), projectController.listAllProject);
projectRoutes.get('/getActiveMembers', webAuth, role(3), projectController.getActiveMembers);

projectRoutes.use('**', _404);
module.exports = projectRoutes;