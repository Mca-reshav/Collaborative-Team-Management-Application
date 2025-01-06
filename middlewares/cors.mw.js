const { webPageDomain } = require("../config/main.config");
const { msg } = require("../messages/log.messages");
const { log, originLog } = require("../services/response.service");
const allowedDomains = webPageDomain[0].split(",");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin)
    return res.json(log(false, msg.ORIGIN_NOT_FOUND));
  else if (allowedDomains.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );
    next();
    originLog(true, origin);
  } else {
    originLog(false, origin);
    return res.json(log(false, msg.NOT_ALLOWED_ORIGIN));
  }
};