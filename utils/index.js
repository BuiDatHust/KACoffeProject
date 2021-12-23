const createTokenUser = require('./createTokenUser');
const { generateAccessToken, isToken, attachTokenToRes } = require('./jwt');
const Permission = require('./Permission');

module.exports = {
    createTokenUser,
    generateAccessToken,
    isToken,
    attachTokenToRes,
    Permission,
};
