const { jwtConfig } = require("../config/main.config");
const jwt = require("jsonwebtoken");

module.exports = {
  generateJwt: async (data) => {
    return new Promise(async (resolve) => {
      let jwtData = jwt.sign(data, jwtConfig.secretKey, {
        expiresIn: jwtConfig.expiresIn,
      });
      resolve({
        status: true,
        token: jwtData,
      });
    });
  },
  verifyJwt: async (token) => {
    return new Promise((resolve) => {
      try {
        const decoded = jwt.verify(token, jwtConfig.secretKey);
        resolve({
          status: true,
          jwtData: decoded,
        });
      } catch (error) {
        resolve({
          status: false,
        });
      }
    });
  },
  extractBearerToken: (authorizationHeader) => {
    const checkBearer = authorizationHeader?.startsWith("Bearer ");
    if (!checkBearer) return false;
    return authorizationHeader.substring(7);
  },
};