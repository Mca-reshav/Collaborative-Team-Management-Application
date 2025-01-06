const express = require("express");

const usersRoutes = require("./users.routes");
const dashboardRoutes = require("./dashboard.routes");
const projectRoutes = require("./projects.routes");
const taskRoutes = require("./tasks.routes");

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/project", projectRoutes);
router.use("/task", taskRoutes);

module.exports = router;
