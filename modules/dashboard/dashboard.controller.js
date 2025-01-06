const { find, aggregation } = require("../../services/mongo.service");
const { error, log } = require("../../services/response.service");
const moment = require("moment");

exports.getProjectsCount = async (req, res) => {
  try {
    const getCount = await find({
      model: "ProjectCTMA",
      query: {},
      attributes: ["projectStatus"],
    });
    if (getCount?.length > 0) {
      const obj = {
        active: 0,
        archived: 0,
        completed: 0,
      };
      for (let i = 0; i < getCount.length; i++) {
        if (getCount[i].projectStatus == "1") obj.active++;
        else if (getCount[i].projectStatus == "2") obj.archived++;
        else if (getCount[i].projectStatus == "3") obj.completed++;
      }
      return res.json(log(true, "Get projects count", obj));
    } else return res.json(log(false, "Get projects count"));
  } catch (err) {
    error(err);
  }
};

exports.getTasksCount = async (req, res) => {
  try {
    const getCount = await find({
      model: "TaskCTMA",
      query: {},
      attributes: ["taskStatus"],
    });
    if (getCount?.length > 0) {
      const obj = {
        todo: 0,
        inprogress: 0,
        done: 0,
      };
      for (let i = 0; i < getCount.length; i++) {
        if (getCount[i].taskStatus == "1") obj.todo++;
        else if (getCount[i].taskStatus == "2") obj.inprogress++;
        else if (getCount[i].taskStatus == "3") obj.done++;
      }
      return res.json(log(true, "Get tasks count", obj));
    } else return res.json(log(false, "Get tasks count"));
  } catch (err) {
    error(err);
  }
};

exports.getMembersCount = async (req, res) => {
  try {
    const getCount = await find({
      model: "UserCTMA",
      query: {},
      attributes: ["status"],
    });
    if (getCount?.length > 0) {
      const obj = {
        inactive: 0,
        active: 0,
      };
      for (let i = 0; i < getCount.length; i++) {
        if (getCount[i].status == "0") obj.inactive++;
        else if (getCount[i].status == "1") obj.active++;
      }
      return res.json(log(true, "Get members count", obj));
    } else return res.json(log(false, "Get members count"));
  } catch (err) {
    error(err);
  }
};

exports.upcomingTask = async (req, res) => {
  try {
    const startDate = moment(
      moment().clone().subtract(2, "days").toDate()
    ).format("YYYY-MM-DD");
    const endDate = moment(moment().clone().add(2, "days").toDate()).format(
      "YYYY-MM-DD"
    );
    const getData = await aggregation({
      model: "TaskCTMA",
      query: [
        { $match: { dueDate: { $gte: startDate, $lte: endDate } } },
        { $sort: { dueDate: 1 } },
        { $limit: 3 },
        {
          $project: {
            taskId: 1,
            taskTitle: 1,
            priority: 1,
            dueDate: 1,
            assignedAt: 1,
          },
        },
      ],
    });
    if (getData) return res.json(log(true, "Success", getData));
    return res.json(log(false, "Error on upcoming tasks"));
  } catch (err) {
    error(err);
  }
};

exports.recentActivity = async (req, res) => {
  try {
    const recentTask = await aggregation({
      model: "TaskCTMA",
      query: [
        { $sort: { createdAt: -1, updatedAt: -1 } },
        { $limit: 1 },
        {
          $project: {
            taskId: 1,
            taskTitle: 1,
            taskStatus: 1,
            createdAt: 1,
          },
        },
      ],
    });

    const recentUser = await aggregation({
      model: "UserCTMA",
      query: [
        { $sort: { createdAt: -1, updatedAt: -1 } },
        { $limit: 1 },
        { $project: { empId: 1, name: 1, status: 1, createdAt: 1 } },
      ],
    });

    const recentActivityData = await aggregation({
      model: "ActivityCTMA",
      query: [
        { $sort: { createdAt: -1, updatedAt: -1 } },
        { $limit: 1 },
        {
          $project: {
            entityId: 1,
            entityType: 1,
            currentStatus: 1,
            createdAt: 1,
          },
        },
      ],
    });

    const recentProject = await aggregation({
      model: "ProjectCTMA",
      query: [
        { $sort: { createdAt: -1, updatedAt: -1 } },
        { $limit: 1 },
        {
          $project: {
            projectId: 1,
            projectTitle: 1,
            projectStatus: 1,
            createdAt: 1,
          },
        },
      ],
    });
    const combinedResults = [
      ...recentTask,
      ...recentUser,
      ...recentActivityData,
      ...recentProject,
    ];

    const sortedResults = combinedResults.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return res.json(log(true, "Success", sortedResults));
  } catch (err) {
    error(err);
  }
};

exports.seeActivity = async (req, res) => {
  try {
    const getData = await aggregation({
      model: "ActivityCTMA",
      query: [
        {
          $lookup: {
            from: "userctmas",
            localField: "performedBy",
            foreignField: "userId",
            as: "userDetails",
          },
        },

        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            activityId: 1,
            entityType: 1,
            entityId: 1,
            actionType: 1,
            performedBy: "$userDetails.name",
            previousStatus: 1,
            currentStatus: 1,
            performedAt: 1,
            createdAt: 1,
          },
        },
      ],
    });
    return res.json(log(true, "success on fetching activity", getData));
  } catch (err) {
    error(err);
  }
};
