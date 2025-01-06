module.exports = {
  port: process.env.PORT,

  jwtConfig: {
    secretKey: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  mongoConfig: {
    protocol: "mongodb",
    host: process.env.HOST,
    database: process.env.DATABASE,
    queryLogs: true,
  },
  webPageDomain: ['*']
  // redisConfig: {
  //   url: process.env.URL,
  //   password: process.env.PASSWORD,
  // },
};
