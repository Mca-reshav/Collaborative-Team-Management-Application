const moment = require("moment");
const { error } = require("./response.service");
const crypto = require("crypto");

const current = moment().format('HHmmss');

module.exports = {
  getCurrentTimeStamp: () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  },
  validateDate: (date) => {
    if (!date) return false;
    return moment(date).isValid();
  },
  ageEligibility: (dateOfBirth) => {
    const age = moment().diff(moment(dateOfBirth, "YYYY-MM-DD"), "years");
    return age > 18;
  },
  generateID: (contactNo) => {
    try {
      const randomStart = crypto.randomBytes(4).toString("hex").slice(0, 2);
      const randomEnd = crypto.randomBytes(4).toString("hex").slice(0, 2);
      return `${randomStart.toUpperCase()}${String(contactNo).slice(-4)}${randomEnd.toUpperCase()}`;
    } catch (err) {
      error(err);
    }
  },
  generateTaskId: () => {
    return crypto.randomBytes(4).toString("hex").slice(0, 4)+'T'+current+crypto.randomBytes(4).toString("hex").slice(0, 4);
  },
  generateProjectId: () => {
    return crypto.randomBytes(4).toString("hex").slice(0, 4)+'P'+current+crypto.randomBytes(4).toString("hex").slice(0, 4);
  },
  generateActivityId: () => {
    return crypto.randomBytes(4).toString("hex").slice(0, 4)+'A'+current+crypto.randomBytes(4).toString("hex").slice(0, 4);
  },
};