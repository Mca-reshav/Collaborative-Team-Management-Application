const { mongoose } = require("../database/mongo.conn");
const { getCurrentTimeStamp } = require("../services/common.service");
const { userStatus, roleType, genderType, isAssigned,designationType} = require("../constants/models.const");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    allowNull: false,
    unique: true,
  },
  empId: {
    type: String,
    required: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    allowNull: false,
  },
  emailId: {
    type: String,
    required: true,
    allowNull: false,
    unique: true,
  },
  contactNo: {
    type: Number,
    required: true,
    allowNull: false,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    allowNull: false,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
    enum: Object.keys(genderType),
    default: genderType[3],
  },
  dateOfBirth: {
    type: String,
    required: true,
    allowNull: false,
  },
  designation: {
    type: String,
    allowNull: true,
    enum: Object.keys(designationType),
    default: Object.keys(designationType)[2],
  },
  role: {
    type: String,
    allowNull: true,
    enum: Object.keys(roleType),
    default: Object.keys(roleType)[2],
  },
  status: {
    type: String,
    allowNull: true,
    enum: Object.keys(userStatus),
    default: Object.keys(userStatus)[0],
  },
  isAssigned: {
    type: String,
    allowNull: true,
    enum: Object.keys(isAssigned),
    default: Object.keys(isAssigned)[0],
  },
  createdAt: {
    type: String,
    required: true,
    default: getCurrentTimeStamp(),
  },
  updatedAt: {
    type: String,
    allowNull: true,
  },
});

exports.UserCTMA = mongoose.model("UserCTMA", userSchema);
