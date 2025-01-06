module.exports = {
  entityTypes: Object.freeze({
    1: "Project",
    2: "Task",
    3: "Other",
    4: "User"
  }),

  actionTypes: Object.freeze({
    1: "Assign",
    2: "Create",
    3: "Delete",
    4: "Update",
    5: "Other",
    6: "Moved"
  }),
  
  projectTypes: Object.freeze({
    1: "Active",
    2: "Archived",
    3: "Completed",
  }),
  priorityType: Object.freeze({
    1: "High",
    2: "Medium",
    3: "Low",
  }),

  statusType: Object.freeze({
    1: "To Do",
    2: "In Progress",
    3: "Done",
    4: "Removed",
    5: "Created"
  }),
  genderType: Object.freeze({
    1: "Male",
    2: "Female",
    3: "Other",
  }),
  designationType: Object.freeze({
    1: "Chief",
    2: "Managerial",
    3: "Employee",
  }),
  roleType: Object.freeze({
    1: "Admin",
    2: "Project Manager",
    3: "Team Member",
  }),
  userStatus: Object.freeze({
    1: "Active",
    0: "InActive",
  }),
  isAssigned: Object.freeze({
    1: "Yes",
    0: "No",
  }),
};
