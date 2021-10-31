const {StatusCodes} = require('http-status-codes')
const CustomApi = require("./customApiError");

class NotFoundError extends CustomApi {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}

module.exports = NotFoundError