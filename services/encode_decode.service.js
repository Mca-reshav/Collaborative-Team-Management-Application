const { error } = require("./response.service");

module.exports = {
  encodeUserId: async (contactNo, emailId) => {
    try {
      const combinedData = `${contactNo}:${emailId.split('@')[0]}`;
      return Buffer.from(combinedData).toString("base64");
    } catch (err) {
      error(err);
    }
  },
  decodeUserId: async (encodedUserId) => {
    try {
      const decodedData = Buffer.from(encodedUserId, "base64").toString(
        "utf-8"
      );
      const [contactNo, emailId] = decodedData.split(":");
      return { contactNo, emailId };
    } catch (err) {
      error(err);
    }
  },
};