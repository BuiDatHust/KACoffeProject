const {StatusCodes} = require('http-status-codes')
const customApiError = require("./customApiError");

class UnauthentiatedError extends customApiError {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthentiatedError