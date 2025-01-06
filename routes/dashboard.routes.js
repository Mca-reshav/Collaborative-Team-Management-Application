const express = require('express');
const dashboardRoutes = express.Router();

const mw = require('../middlewares/main.mw');
const {validate, _404, role, webAuth} = mw.one;

dashboardRoutes.use(mw.global);

const dashController = require('../modules/dashboard/dashboard.controller');

dashboardRoutes.get('/projectsCount', webAuth, dashController.getProjectsCount);
dashboardRoutes.get('/tasksCount', webAuth, dashController.getTasksCount);
dashboardRoutes.get('/membersCount', webAuth, dashController.getMembersCount);

dashboardRoutes.get('/upcomingTask', webAuth, dashController.upcomingTask);
dashboardRoutes.get('/recentActivity', webAuth, dashController.recentActivity);
dashboardRoutes.get('/seeActivity', webAuth, dashController.seeActivity);

dashboardRoutes.use('**', _404);
module.exports = dashboardRoutes;