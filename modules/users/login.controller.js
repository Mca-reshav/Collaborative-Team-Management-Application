const encryptService = require("../../services/encrypt.service");
const { generateJwt } = require("../../services/jwt.service");
const { user } = require("../../messages/log.messages");
const { find } = require("../../services/mongo.service");
const { error, log, success, tokenLog } = require("../../services/response.service");

exports.login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const getData = await find({
      model: "UserCTMA",
      query: { emailId: emailId },
      attributes: ["userId", "password"],
    });
    const userId = getData[0]?.userId;
    if (!userId) return res.json(log(false, user.NOT_REG));

    const checkPwd = await encryptService.comparePassword(
      password,
      getData[0].password
    );
    if (!checkPwd) return res.json(log(false, user.WRONG_PASSWORD));

    const getToken = await generateJwt({ userId });
    tokenLog(getToken.token);
    success(true, user.LOGGED_IN);
    const sortInitials = String(emailId).split('@')[0];
    return res.json(log(true, user.LOGGED_IN, {authToken: getToken.token, userId: userId, initial: sortInitials}));
  } catch (err) {
    error(err);
  }
};
