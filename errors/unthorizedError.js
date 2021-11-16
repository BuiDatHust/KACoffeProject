const {StatusCodes} = require('http-status-codes')
const customApiError = require("./customApiError");

class UnauthorizedError extends customApiError {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthorizedError