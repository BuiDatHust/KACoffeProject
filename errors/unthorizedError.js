const {StatusCodes} = require('http-status-codes')
const CustomApi = require("./customApiError");

class UnauthorizedError extends CustomApi {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthorizedError