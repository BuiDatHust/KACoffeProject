const { StatusCodes } = require('http-status-codes');
const customApiError = require('./customApiError');

class NotFoundError extends customApiError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;
