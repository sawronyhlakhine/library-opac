class ErrorResponse extends Error {
    constructor(message, statusCode, body) {
        super(message);
        this.statusCode = statusCode;
        this.body = body;
    }
}

module.exports = ErrorResponse;