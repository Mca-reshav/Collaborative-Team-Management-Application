const { encodeUserId } = require("../../services/encode_decode.service");
const encryptService = require("../../services/encrypt.service");
const { generateJwt } = require("../../services/jwt.service");
const { user } = require("../../messages/log.messages");
const { create, find } = require("../../services/mongo.service");
const {
  error,
  log,
  success,
  tokenLog,
} = require("../../services/response.service");
const {
  validateDate,
  ageEligibility,
  generateID,
} = require("../../services/common.service");
const moment = require('moment');
const { activityStatus } = require("../../constants/common.const");
const { entityTypes, actionTypes } = require("../../constants/models.const");
const { logActivity } = require("../../services/activityLog.service");

exports.register = async (req, res) => {
  try {
    const { emailId, contactNo, name, dateOfBirth, gender, password } =
      req.body;
    if (!validateDate(dateOfBirth))
      return res.json(log(false, user.INVALID_DATE));
    if (!ageEligibility(dateOfBirth))
      return res.json(log(false, user.AGE_CRITERIA));

    const userId = await encodeUserId(contactNo, emailId);
    const isExist = await find({
      model: "UserCTMA",
      query: {
        $or: [{ contactNo: contactNo }, { emailId: emailId }],
      },
      attributes: ["userId"],
    });

    const newUser = isExist.length == 0;
    if (!newUser) {
      return res.json(log(false, user.ALREADY_EXIST, {}));
    } else {
      const encPwd = await encryptService.hashPassword(password);
      const empId = generateID(contactNo)
      const userEntry = await create({
        model: "UserCTMA",
        data: {
          userId: userId,
          empId: empId,
          name: name,
          emailId: emailId,
          contactNo: contactNo,
          gender: gender,
          dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD'),
          password: encPwd,
        },
      });

      if (!userEntry) {
        success(false, user.FAILED);
        return res.json(log(userEntry, user.FAILED, {}));
      }

      const getToken = await generateJwt({ userId });
      tokenLog(getToken.token);
      success(true, user.REGISTER_DONE);
      await logActivity(
        empId,
        Object.keys(entityTypes)[4],
        Object.keys(actionTypes)[2],
        userId,
        "",
        activityStatus.MEMBER_CREATED
      );
      return res.json(log(true, user.REGISTER_DONE, {authToken: getToken.token, userId: userId}));
    }
  } catch (err) {
    error(err);
  }
};
