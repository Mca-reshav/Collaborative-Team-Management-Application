const { activityStatus } = require("../../constants/common.const");
const { entityTypes, actionTypes } = require("../../constants/models.const");
const { logActivity } = require("../../services/activityLog.service");
const { generateTaskId } = require("../../services/common.service");
const {
  create,
  find,
  aggregation,
  updateOne,
} = require("../../services/mongo.service");
const { log, error } = require("../../services/response.service");
const moment = require("moment");

exports.add = async (req, res) => {
  const { projectId, taskTitle, taskDesc, dueDate, priority } = req.body;
  const userId = req.user.userId;
  const genId = generateTaskId();

  const addData = await create({
    model: "TaskCTMA",
    data: {
      taskId: genId,
      projectId: projectId,
      taskTitle: taskTitle,
      taskDescription: taskDesc || "",
      dueDate: dueDate,
      priority: priority,
      taskStatus: "1",
      createdBy: userId,
    },
  });
  if (addData) {
    await logActivity(
      genId,
      Object.keys(entityTypes)[1],
      Object.keys(actionTypes)[1],
      userId,
      "",
      activityStatus.TASK_CREATED
    );
    return res.json(log(true, "New task created", {}));
  }
  return res.json(log(false, "Error on adding a new task"));
};

exports.update = async (req, res) => {
  const {
    taskId,
    taskTitle,
    taskDescription,
    dueDate,
    priority,
    taskStatus,
    remark,
  } = req.body;
  const userId = req.user.userId;
  console.log(
    taskId,
    taskTitle,
    taskDescription,
    dueDate,
    priority,
    taskStatus,
    remark
  );
  return res.json(log(true, "Success"));
  const updateData = await updateOne({
    model: "TaskCTMA",
    query: { taskId: taskId },
    data: {
      taskTitle: taskTitle,
      taskDescription: taskDescription,
      dueDate: dueDate,
      priority: priority,
      taskStatus: taskStatus,
      updatedBy: userId,
      updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      remark: remark,
    },
  });
  if (updateData) return res.json(log(true, "Success"));
  return res.json(log(false, "Error on updating task"));
};

exports.delete = async (req, res) => {
  const { taskId, remark } = req.body;
  const userId = req.user.userId;
  console.log(taskId, remark);
  return res.json(log(true, "Success"));
  const updateData = await updateOne({
    model: "TaskCTMA",
    query: { taskId: taskId },
    data: {
      taskStatus: "4",
      deletedBy: userId,
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      remark: remark,
    },
  });
  if (updateData) return res.json(log(true, "Success"));
  return res.json(log(false, "Error on deleting task"));
};

exports.getTaskDetails = async (req, res) => {
  const { taskId } = req.params;
  const getData = await aggregation({
    model: "TaskCTMA",
    query: [
      {
        $match: {
          taskId: taskId,
        },
      },

      {
        $lookup: {
          from: "userctmas",
          localField: "createdBy",
          foreignField: "userId",
          as: "createdByUser",
        },
      },

      {
        $lookup: {
          from: "userctmas",
          localField: "updatedBy",
          foreignField: "userId",
          as: "updatedByUser",
        },
      },

      {
        $lookup: {
          from: "userctmas",
          localField: "deletedBy",
          foreignField: "userId",
          as: "deletedByUser",
        },
      },

      {
        $lookup: {
          from: "userctmas",
          localField: "assignedBy",
          foreignField: "userId",
          as: "assignedByUser",
        },
      },

      {
        $lookup: {
          from: "userctmas",
          localField: "assignedTo",
          foreignField: "userId",
          as: "assignedToUser",
        },
      },

      {
        $project: {
          projectId: 1,
          taskTitle: 1,
          taskDescription: 1,
          dueDate: 1,
          priority: 1,
          taskStatus: 1,
          assignedTo: { $arrayElemAt: ["$assignedToUser.name", 0] },
          assignedBy: { $arrayElemAt: ["$assignedByUser.name", 0] },
          assignedAt: 1,
          createdBy: { $arrayElemAt: ["$createdByUser.name", 0] },
          createdAt: 1,
          updatedBy: { $arrayElemAt: ["$updatedByUser.name", 0] },
          updatedAt: 1,
          startedAt: 1,
          completedBy: { $arrayElemAt: ["$assignedToUser.name", 0] },
          completedAt: 1,
          deletedBy: { $arrayElemAt: ["$deletedByUser.name", 0] },
          deletedAt: 1,
        },
      },
    ],
  });
  if (getData) return res.json(log(true, "Success", getData));
  return res.json(log(false, "Error on getting task details"));
};

exports.getAllList = async (req, res) => {
  const getData = await aggregation({
    model: "TaskCTMA",
    query: [
      {
        $lookup: {
          from: "userctmas",
          let: { assignedToId: "$assignedTo" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$userId", "$$assignedToId"] }],
                },
              },
            },
            {
              $project: { name: 1, userId: 1 },
            },
          ],
          as: "assignedToDetails",
        },
      },
      {
        $unwind: {
          path: "$assignedToDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "userctmas",
          let: { assignedById: "$assignedBy" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$userId", "$$assignedById"] }],
                },
              },
            },
            {
              $project: { name: 1, userId: 1 },
            },
          ],
          as: "assignedByDetails",
        },
      },
      {
        $unwind: {
          path: "$assignedByDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "userctmas",
          let: { createdById: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$userId", "$$createdById"] }],
                },
              },
            },
            {
              $project: { name: 1, userId: 1 },
            },
          ],
          as: "createdByDetails",
        },
      },
      {
        $unwind: {
          path: "$createdByDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          taskId: 1,
          projectId: 1,
          taskTitle: 1,
          dueDate: 1,
          priority: 1,
          taskStatus: 1,
          createdAt: 1,
          assignedTo: "$assignedToDetails.name",
          assignedBy: "$assignedByDetails.name",
          createdBy: "$createdByDetails.name",
          assignedAt: 1,
        },
      },
    ],
  });
  if (getData) return res.json(log(true, "success", getData));
  return res.json(log(false, ""));
};

exports.move = async (req, res) => {
  try {
    const { taskId, taskStatus } = req.body;
    const current = moment().format("YYYY-MM-DD HH:mm:ss");

    if (taskStatus == "1") {
      const updateTask = await updateOne({
        model: "TaskCTMA",
        query: { taskId: taskId },
        data: {
          taskStatus: '2',
          startedAt: current,
          updatedBy: req.user.userId,
        },
      });
      if (updateTask) {
        await logActivity(
          taskId,
          Object.keys(entityTypes)[1],
          Object.keys(actionTypes)[5],
          req.user.userId,
          activityStatus.TASK_MOVED_TO_TODO,
          activityStatus.TASK_MOVED_TO_INPROGRESS
        );
        return res.json(log(true, "Success on move task to in-progress"));
      }
    } else if (taskStatus == "2") {
      const completeTask = await updateOne({
        model: "TaskCTMA",
        query: { taskId: taskId },
        data: {
          taskStatus: '3',
          completedAt: current,
          completedBy: req.user.userId,
        },
      });
      if (completeTask) {
        await logActivity(
          taskId,
          Object.keys(entityTypes)[1],
          Object.keys(actionTypes)[5],
          req.user.userId,
          activityStatus.TASK_MOVED_TO_INPROGRESS,
          activityStatus.TASK_MOVED_TO_DONE
        );
        return res.json(log(true, "Success on move task to done"));
      }
    } else return res.json(log(false, "Internal error"));
  } catch (err) {
    error(err);
  }
};

exports.kanbanTask = async (req, res) => {
  const userId = req.user.userId;
  const getData = await find({
    model: "TaskCTMA",
    query: {},
    attributes: ["taskStatus", "taskId", "assignedTo", "taskTitle", "priority"],
  });
  if (getData) {
    const respObj = {
      todo: {
        id: "",
        title: "",
        assignedTo: "",
      },
      inProgress: {
        id: "",
        title: "",
        assignedTo: "",
      },
      done: {
        id: "",
        title: "",
        assignedTo: "",
      },
    };
    for (let i = 0; i < getData.length; i++) {
      if (getData[i].taskStatus == "1") {
        respObj.todo.id = getData[i].taskId;
        respObj.todo.title = getData[i].taskTitle;
        respObj.todo.assignedTo = getData[i].assignedTo;
      } else if (getData[i].taskStatus == "2") {
        respObj.inProgress.id = getData[i].taskId;
        respObj.inProgress.title = getData[i].taskTitle;
        respObj.inProgress.assignedTo = getData[i].assignedTo;
      } else if (getData[i].taskStatus == "3") {
        respObj.done.id = getData[i].taskId;
        respObj.done.title = getData[i].taskTitle;
        respObj.done.assignedTo = getData[i].assignedTo;
      }
    }
    return res.json(log(true, "success", respObj));
  }
  return res.json(log(false, "error on loading kanban"));
};

exports.listActiveProjects = async (req, res) => {
  const getData = await find({
    model: "ProjectCTMA",
    query: { projectStatus: "1" },
    attributes: ["projectId", "projectTitle"],
  });
  if (getData) return res.json(log(true, "success", getData));
  return res.json(log(false, "Internal error"));
};

exports.assignTask = async (req, res) => {
  try {
    const { userId, taskId } = req.body;
    const current = moment().format("YYYY-MM-DD HH:mm:ss");
    const updateTaskData = await updateOne({
      model: "TaskCTMA",
      query: { taskId: taskId },
      data: {
        taskStatus: "1",
        assignedTo: userId,
        assignedBy: req.user.userId,
        assignedAt: current,
      },
    });
    if (updateTaskData) {
      const updateUserData = await updateOne({
        model: "UserCTMA",
        query: { userId: userId },
        data: {
          isAssigned: "1",
          updatedAt: current,
        },
      });
      if (updateUserData) {
        await logActivity(
          taskId,
          Object.keys(entityTypes)[1],
          Object.keys(actionTypes)[0],
          userId,
          activityStatus.TASK_CREATED,
          activityStatus.TASK_MOVED_TO_DONE
        );
        return res.json(log(true, "Success"));
      } else return res.json(log(false, "Error on updating user data"));
    } else return res.json(log(true, "Error on assigning task"));
  } catch (err) {
    error(err);
  }
};
