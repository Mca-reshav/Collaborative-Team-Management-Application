const { generateActivityId } = require("./common.service");
const { create } = require("./mongo.service");
const { error } = require("./response.service");

exports.logActivity = async (
  id = "",
  type = "",
  action = "",
  by = "",
  previous = "",
  current = "",
) => {
  try {
    const genId = generateActivityId();
    const logData = await create({
      model: "ActivityCTMA",
      data: {
        activityId: genId,
        entityType:type,
        entityId: id,
        actionType: action,
        performedBy: by,
        previousStatus: previous || "None",
        currentStatus: current || "",
      },
    });

    if (logData) return true;
    return false;
  } catch (err) {
    error(err);
  }
};
