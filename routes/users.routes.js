const express = require('express');
const usersRoutes = express.Router();
const mw = require('../middlewares/main.mw');
const {validate, _404, role, webAuth} = mw.one;
usersRoutes.use(mw.global);

const loginController = require('../modules/users/login.controller');
const registerController = require('../modules/users/register.controller');
const commonController = require('../validators/common.validator');
const userController = require('../modules/users/user.controller');
const userValidator = require('../validators/user.validator');

usersRoutes.post('/login', validate(commonController.login), loginController.login)
usersRoutes.post('/register', validate(commonController.register), registerController.register)

usersRoutes.post('/assign', webAuth, role(2), validate(userValidator.assign), userController.assignUser)
usersRoutes.put('/update', webAuth, role(2), validate(userValidator.update), userController.updateUser)
usersRoutes.post('/toggleStatus', webAuth, role(2), validate(userValidator.toggleStatus),userController.toggleUserStatus)
usersRoutes.get('/getList', webAuth, userController.listAllUser)
usersRoutes.get('/listAvailableUsers', webAuth, userController.listAvailableUsers)
usersRoutes.get('/profile/:empId', webAuth, userController.getUserDetails)

usersRoutes.use('**', _404);
module.exports = usersRoutes;