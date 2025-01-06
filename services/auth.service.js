const authService = require("./encrypt.service");
const { success, error } = require("./response.service");

exports.hashPwd = async (password) => {
    try {
        const hashedPassword = await authService.hashPassword(password);
        success(hashedPassword)
        return true;
    } catch (err) {
        error(`Error hashing password: ${err.message}`);
    }
}

exports.comparePwd = async (inputPwd, hashedPwd) => {
    try {
        const isMatch = await authService.comparePassword(inputPwd, hashedPwd);
        success(isMatch)
        return isMatch
    } catch (err) {
        error(`Error comparing password: ${err.message}`);
    }
};