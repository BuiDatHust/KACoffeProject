const {StatusCodes} = require('http-status-codes')
const CustomApi = require("./customApiError");

class UnauthentiatedError extends CustomApi {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthentiatedError