const { generateProjectId } = require("../../services/common.service");
const {
  create,
  find,
  aggregation,
  updateOne,
  updateMany,
  findOne,
} = require("../../services/mongo.service");
const { log } = require("../../services/response.service");
const moment = require('moment')
const {logActivity} = require("../../services/activityLog.service"); 
const { entityTypes, actionTypes } = require("../../constants/models.const");
const { activityStatus } = require("../../constants/common.const");

exports.createProject = async (req, res) => {
  const { projectTitle, projectDescription, members } = req.body;
  const userId = req.user.userId;
  const genId = generateProjectId();
  const addData = await create({
    model: "ProjectCTMA",
    data: {
      projectId: genId,
      projectTitle: projectTitle,
      projectDescription: projectDescription || "",
      createdBy: userId,
      teamMembers: members,
    },
  });
  if (addData) {
    await logActivity(
      genId,
      Object.keys(entityTypes)[0],
      Object.keys(actionTypes)[1],
      userId,
      "",
      activityStatus.PROJECT_CREATED
    );
    return res.json(log(true, "New project created", {}));
  }
  return res.json(log(false, "Error on creating a new project"));
};

exports.updateProject = async (req, res) => {
  const { projectId, projectTitle, projectDescription, projectStatus, remark } = req.body;
  const { userId } = req.user;
  const current = moment().format('YYYY-MM-DD HH:mm:ss');
  const updateObj = {
    projectTitle: projectTitle,
    projectDescription: projectDescription,
    projectStatus: projectStatus ? '3' : '1',
    updatedAt:current,
    updatedBy: userId,
    remark: remark
  }
  if (projectStatus) {
    updateObj.completedBy = userId
    updateObj.completedAt = current
  }
  const updateData = await updateOne({
    model: "ProjectCTMA",
    query: { projectId: projectId },
    data: updateObj,
  });
  if (updateData) {
    const isLogged = await logActivity(
      projectId,
      Object.keys(entityTypes)[1],
      Object.keys(actionTypes)[3],
      userId,
      activityStatus.PROJECT_CREATED,
      activityStatus.PROJECT_UPDATED
    );
    if (isLogged && projectStatus == '3') {
      const updateTask = await updateMany({
        model: 'TaskCTMA',
        data: {
          taskStatus: 3,
          completedAt: current,
          completedBy: userId
        },
        query: { projectId: projectId}
      });

      const updateUser = await updateMany({
        model: 'UserCTMA',
        data: {
          isAssigned: '0'
        },
        query: { userId: userId}
      })

      if (updateTask && updateUser) return res.json(log(true, "Success on updating project details"));
      return res.json(log(true, "Error on updating project details"));
    }
    return res.json(log(true, "Success on updating project"));
  }
  return res.json(log(true, "Error on updating project"));
};

exports.deleteProject = async (req, res) => {
  const { projectId, remark} = req.body;
  const userId = req.user.userId;
  const current = moment().format("YYYY-MM-DD HH:mm:ss");
  const updateProject = await updateOne({
    model: "ProjectCTMA",
    query: { projectId: projectId },
    data: {
      projectStatus: "2",
      deletedAt: current,
      deletedBy: userId,
      remark: remark
    },
  });

  if (updateProject) {
    const updateTask = await updateMany({
      model: "TaskCTMA",
      data: {
        taskStatus: "4",
        deletedAt: current,
        deletedBy: userId,
      },
      query: { projectId: projectId },
    });
    if (updateTask) {
      await logActivity(
        projectId,
        Object.keys(entityTypes)[0],
        Object.keys(actionTypes)[2],
        userId,
        activityStatus.PROJECT_UPDATED,
        activityStatus.PROJECT_DELETED
      );
      return res.json(log(true, "Successfully deleted", {}));
    }
    else return res.json(log(false, "Error on deleting task"));
  } else return res.json(log(false, "Error on deleting project"));
};

exports.listProject = async (req, res) => {
  const { projectId } = req.params;

  const respObj = {}
  const getData = await aggregation({
    model: "ProjectCTMA",
    query: [
      {
        $match: {
          projectId: projectId, 
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
          localField: "completedBy",
          foreignField: "userId",
          as: "completedByUser",
        },
      },

      {
        $project: {
          projectTitle: 1,
          projectDescription: 1,
          teamMembers: 1,
          projectStatus: 1,

          createdBy: { $arrayElemAt: ["$createdByUser.name", 0] },
          createdAt: 1,
          updatedBy: { $arrayElemAt: ["$updatedByUser.name", 0] },
          updatedAt: 1,
          completedBy: { $arrayElemAt: ["$completedByUser.name", 0] },
          completedAt: 1,
          deletedBy: { $arrayElemAt: ["$deletedByUser.name", 0] },
          deletedAt: 1,
        },
      },
    ],
  });
  if (getData.length == 0) return res.json(log(false, "No data found!", {}));
  else {
    respObj.projectDetails = getData;
    const getTaskDetails = await aggregation({
      model: 'TaskCTMA',
      query: [
        {
          $match: {
            projectId: projectId,
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
          $project: {
            taskId: 1, 
            taskTitle: 1,
            createdBy: { $arrayElemAt: ["$createdByUser.name", 0] }, 
            createdAt: 1, 
            priority: 1,
            status: 1, 
            dueDate: 1,
          },
        },
    
        {
          $sort: { createdAt: -1 },
        },
      ],
    });    
    if (getTaskDetails) respObj.taskDetails = getTaskDetails;
    return res.json(log(true, 'Success', respObj));
  }
};

exports.listAllProject = async (req, res) => {
  const getData = await aggregation({
    model: "ProjectCTMA",
    query: [
      {
        $lookup: {
          from: "userctmas",
          let: { members: { $ifNull: ["$teamMembers", []] } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$userId", "$$members"],
                },
              },
            },
            {
              $project: { name: 1, userId: 1 }, 
            },
          ],
          as: "teamMemberDetails",
        },
      },
      {
        $lookup: {
          from: "userctmas",
          let: { createdBy: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$createdBy"],
                },
              },
            },
            {
              $project: { name: 1, userId: 1 }, 
            },
          ],
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
        $project: {
          projectId: 1,
          projectTitle: 1,
          projectDescription: 1,
          teamMembers: {
            $map: {
              input: "$teamMemberDetails", 
              as: "member",
              in: "$$member.name", 
            },
          },
          projectStatus: 1,
          createdAt: 1,
          createdBy: "$userDetails.name", 
        },
      },
    ],
  });
  if (getData) return res.json(log(true, "Success", getData));
  return res.json({});
};

exports.getActiveMembers = async (req, res) => {
  const getData = await find({
    model: "UserCTMA",
    query: { status: "1" },
    attributes: ["userId", "name"],
  });
  if (getData) return res.json(log(true, "success", getData));
  return res.json(log(false, "Error on getting active members"));
};
