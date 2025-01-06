const { verifyJwt, extractBearerToken } = require("../services/jwt.service");
const { log } = require("../services/response.service");
const { msg } = require("../messages/log.messages");

module.exports = async (req, res, next) => {
  if (!req.headers["authorization"])
    return res.status(403).json(log(false, msg.AUTH_HEADER));
  try {
    const token = extractBearerToken(req.headers["authorization"]),
      verifyJwtData = await verifyJwt(token);
    if (!verifyJwtData.status)
      return res.status(403).json(log(false, msg.NOT_VERIFIED));
    req.user = verifyJwtData.jwtData;
    next();
  } catch (error) {
    return res.status(403).json(log(false, msg.INTERNAL_ERROR));
  }
};