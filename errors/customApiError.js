class customApiError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = customApiError;
