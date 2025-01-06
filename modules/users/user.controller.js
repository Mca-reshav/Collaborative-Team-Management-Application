const { activityStatus } = require("../../constants/common.const");
const {
  userStatus,
  entityTypes,
  actionTypes,
} = require("../../constants/models.const");
const { logActivity } = require("../../services/activityLog.service");
const { findOne, find, updateOne } = require("../../services/mongo.service");
const { error, log } = require("../../services/response.service");
const moment = require("moment");

exports.assignUser = async (req, res) => {
  const empId = req.body.userId;
  const userId = req.user.userId;

  if (empId == userId)
    return res.json(log(false, "You cannot assign yourself a role"));
  const checkRole = await getRole(userId);
  console.log(checkRole);
  return res.json({});
};

exports.updateUser = async (req, res) => {
  const userId = req.user.userId;
  const updateData = await updateOne({
    model: "UserCTMA",
    query: { empId: req.body.empId },
    data: { ...req.body, updatedAt: moment().format("YYYY-MM-DD HH:mm:ss") },
  });

  if (updateData) {
    await logActivity(
      req.body.empId,
      Object.keys(entityTypes)[3],
      Object.keys(actionTypes)[3],
      userId,
      activityStatus.MEMBER_CREATED,
      activityStatus.MEMBER_UPDATED)
  }
  return res.json(log(true, "success", req.body));
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const empId = req.params.empId;
    const getStatus = await findOne({
      model: "UserCTMA",
      query: { empId: empId },
      attributes: ["status"],
    });
    const newStatus =
      getStatus?.status == userStatus[0] ? userStatus[1] : userStatus[0];
    const updateData = await updateOne({
      model: "UserCTMA",
      query: { empId: empId },
      data: { status: newStatus },
    });
    if (updateData) {
      await logActivity(
        empId,
        Object.keys(entityTypes)[3],
        Object.keys(actionTypes)[3],
        req.user.userId,
        getStatus?.status,
        newStatus
      );
      return res.json(log(true, "success", updateData));
    }
    return res.json(log(false, "Internal Error", {}));
  } catch (err) {
    error(err);
  }
};

exports.listAllUser = async (req, res) => {
  try {
    let { userId } = req.user;
    const getRole = await findOne({
      model: "UserCTMA",
      query: { userId: userId },
      attributes: ["role"],
    });
    const getData = await find({
      model: "UserCTMA",
      query: {},
      attributes: [
        "empId",
        "name",
        "emailId",
        "contactNo",
        "designation",
        "dateOfBirth",
        "gender",
        "role",
        "status",
        "isAssigned",
        "createdAt",
      ],
    });
    if (getData.length > 0) getData[0].setRole = getRole?.role;
    return res.json(log(true, "Success", getData));
  } catch (err) {
    error(err);
  }
};

exports.listAvailableUsers = async (req, res) => {
  const getData = await find({
    model: "UserCTMA",
    query: { isAssigned: "0", status: "1" },
    attributes: ["userId", "name"],
  });
  if (getData) return res.json(log(true, "Success", getData));
  return res.json(log(false, "Error on listing available users"));
};

exports.getUserDetails = async (req, res) => {
  try {
    const empId = req.params.empId;
    const respObj = {};
    const getUserData = await find({
      model: "UserCTMA",
      query: { empId: empId },
      attributes: [
        "userId",
        "empId",
        "name",
        "emailId",
        "contactNo",
        "gender",
        "dateOfBirth",
        "createdAt",
        "role",
        "status",
        "designation",
        "isAssigned",
      ],
    });
    const userId = getUserData[0]?.userId;
    if (userId) {
      respObj.userData = getUserData;
      const getTaskDetails = await find({
        model: "TaskCTMA",
        query: { assignedTo: userId },
        attributes: [
          "taskId",
          "taskTitle",
          "projectId",
          "taskStatus",
          "assignedAt",
          "startedAt",
          "completedAt",
        ],
      });
      if (getTaskDetails.length > 0) respObj.TaskData = getTaskDetails;
      const checkTiming =
        getTaskDetails[0]?.completedAt && getTaskDetails[0]?.startedAt;
      if (checkTiming)
        getTaskDetails[0].duration = moment(getTaskDetails[0].completedAt).diff(
          getTaskDetails[0].startedAt,
          "hours"
        );
      return res.json(log(true, "Success", respObj));
    } else return res.json(log(false, "Error on fetching user details"));
  } catch (err) {
    console.log(err);
    error(err);
  }
};
