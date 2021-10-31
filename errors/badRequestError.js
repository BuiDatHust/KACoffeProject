const {StatusCodes} = require('http-status-codes')
const CustomApi = require("./customApiError");

class BadRequestError extends CustomApi {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestError