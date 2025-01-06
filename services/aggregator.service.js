const { aggregation } = require("./mongo.service");

exports.getAggregated = async (page, limit) => {
  const validPage = parseInt(page) || 1;
  const validLimit = parseInt(limit) || 5;
  const skip = (validPage - 1) * validLimit;

  const getData = await aggregation({
    model: "EmpEMS",
    query: [
      {
        $lookup: {
          from: "userems",
          localField: "userId",
          foreignField: "userId",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          empName: 1,
          emailId: 1,
          contactNo: 1,
          doj: 1,
          dept: 1,
          role: "$userDetails.role",
          status: "$userDetails.status",
        },
      },
      { $skip: skip },
      { $limit: validLimit },
    ],
  });
  return getData;
};