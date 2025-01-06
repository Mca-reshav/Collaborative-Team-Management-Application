const { mongoose } = require("../database/mongo.conn");
const { projectTypes } = require("../constants/models.const");
const { getCurrentTimeStamp } = require("../services/common.service");

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      allowNull: false,
    },
    projectTitle: {
      type: String,
      required: true,
      allowNull: false,
    },
    projectDescription: {
      type: String,
      required: true,
    },
    teamMembers: {
      type: [String],
      required: true
    },
    projectStatus: {
      type: String,
      required: true,
      enum: Object.keys(projectTypes),
      default: Object.keys(projectTypes)[0],
    },
    createdBy: {
      type: String,
      required: true,
      allowNull: false,
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
    completedAt: {
      type: String,
    },
    deletedBy: {
      type: String,
    },
    deletedAt: {
      type: String,
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: {
      created: "created",
      updated: "updated",
    },
  }
);

exports.ProjectCTMA = mongoose.model("ProjectCTMA", projectSchema);
