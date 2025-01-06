exports.rolesPermission = Object.freeze({
  1: ["1"],
  2: ["1", "2"],
  3: ["1", "2", "3"],
});

exports.activityStatus = Object.freeze({
  TASK_CREATED: "A new task created",
  TASK_UPDATED: "An existing task updated",
  TASK_DELETED: "An existing task deleted",

  PROJECT_CREATED: "A new project created",
  PROJECT_UPDATED: "An existing project updated",
  PROJECT_DELETED: "An existing project deleted",

  MEMBER_CREATED: "A new member created",
  MEMBER_UPDATED: "An existing member details updated",
  MEMBER_DELETED: "An existing member profile suspended",

  TASK_MOVED_TO_TODO: "A task is moved to todo state",
  TASK_MOVED_TO_INPROGRESS: "A task is moved to inprogress state",
  TASK_MOVED_TO_DONE: "A task is moved to done state",

});
