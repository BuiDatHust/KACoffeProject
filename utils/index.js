const createTokenUser =require('./createTokenUser')
const { generateAcessToken, isToken,attachTokenToRes } = require('./jwt') 
const Permission = require('./Permission')

module.exports = {
    createTokenUser,
    generateAcessToken,
    isToken,
    attachTokenToRes,
    Permission
}