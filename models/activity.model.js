const { mongoose } = require("../database/mongo.conn");
const { getCurrentTimeStamp } = require("../services/common.service");
const { actionTypes, entityTypes } = require('../constants/models.const');
const activitySchema = new mongoose.Schema(
  {
    activityId: {
      type: String,
      required: true,
      allowNull: false,
    },
    entityType: {
      type: String,
      enum: Object.keys(entityTypes),
      default: Object.keys(entityTypes)[2]
    },
    entityId: {
      type: String,
      required: true,
      allowNull: false,
    },
    actionType: {
      type: String,
      enum: Object.keys(actionTypes),
      default: Object.keys(actionTypes)[4]
    },
    performedBy: {
      type: String,
      required: true,
      allowNull: false,
    },
    performedAt: {
      type: String,
      required: true,
      default: getCurrentTimeStamp(),
    },
    previousStatus: {
      type: String,
    },
    currentStatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      created: "created",
      updated: "updated",
    },
  }
);

exports.ActivityCTMA = mongoose.model("ActivityCTMA", activitySchema);
