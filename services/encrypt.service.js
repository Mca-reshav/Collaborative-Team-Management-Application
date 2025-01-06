const bcrypt = require("bcrypt");
const { error } = require("./response.service");

const encryptService = {
  /**
   * Hashes a plain text password.
   * @param {string} password - The plain text password.
   * @returns {Promise<string>} - Resolves to the hashed password.
   */
  hashPassword: async (password) => {
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    } catch (err) {
        error(`Error hashing password: ${err.message}`);
    }
  },

  /**
   * Compares a plain text password with a hashed password.
   * @param {string} plainPassword - The plain text password.
   * @param {string} hashedPassword - The hashed password.
   * @returns {Promise<boolean>} - Resolves to true if passwords match, false otherwise.
   */
  comparePassword: async (plainPassword, hashedPassword) => {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (err) {
        error(`Error comparing password: ${err.message}`);
    }
  },
};

module.exports = encryptService;