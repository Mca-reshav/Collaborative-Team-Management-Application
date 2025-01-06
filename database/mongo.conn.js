const mongoose = require("mongoose");
const { mongoConfig } = require("../config/main.config");
const { success, error } = require("../services/response.service");

mongoose
  .connect(`${mongoConfig.protocol}://${mongoConfig.host}`, {
    dbName: mongoConfig.database,
    user: mongoConfig.username,
    pass: mongoConfig.password,
  })
  .then(() => success(true, "MONGODB"))
  .catch((err) => {
    success(false, "MONGODB CONNECTION");
    error(err);
  });

  module.exports = {
    mongoose
};