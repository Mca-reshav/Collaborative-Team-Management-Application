const { mongoose } = require("../database/mongo.conn");
const { getCurrentTimeStamp } = require("../services/common.service");
const {statusType, priorityType} = require("../constants/models.const");

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
      allowNull: false,
      unique: true,
    },
    projectId: {
      type: String,
      required: true,
      allowNull: false,
    },
    taskTitle: {
      type: String,
      required: true,
      allowNull: false,
      unique: true,
    },
    taskDescription: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
      allowNull: false,
    },
    priority: {
      type: String,
      enum: Object.keys(priorityType),
      default: priorityType[2],
      required: true,
    },
    taskStatus: {
      type: String,
      enum: Object.keys(statusType),
      default: statusType[4],
      required: true,
    },
    assignedTo: {
      type: String,
    },
    assignedBy: {
      type: String,
    },
    assignedAt: {
      type: String,
    },
    startedAt: {
      type: String,
    },
    completedAt: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: String,
      required: true,
      default: getCurrentTimeStamp(),
    },
    updatedBy: {
      type: String,
    },
    updatedAt: {
      type: String,
    },
    completedBy: {
      type: String,
    },
    deletedBy: {
      type: String,
    },
    deletedAt: {
      type: String,
    },
    remark: {
      type: String
    }
  },
  {
    timestamps: {
      created: "created",
      updated: "updated",
    },
  }
);

exports.TaskCTMA = mongoose.model("TaskCTMA", taskSchema);
