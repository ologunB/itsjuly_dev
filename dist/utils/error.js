"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.NotFoundError = exports.UnauthorizedError = exports.BadRequestError = exports.MongoError = exports.CustomError = void 0;
const http_status_codes_1 = require("http-status-codes");
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
exports.CustomError = CustomError;
class MongoError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
exports.MongoError = MongoError;
class BadRequestError extends CustomError {
    constructor(message = http_status_codes_1.ReasonPhrases.BAD_REQUEST) {
        super(message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        this.name = "BadRequestError";
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends CustomError {
    constructor(message = http_status_codes_1.ReasonPhrases.UNAUTHORIZED) {
        super(message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
        this.name = "UnauthorizedError";
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotFoundError extends CustomError {
    constructor(message = http_status_codes_1.ReasonPhrases.NOT_FOUND) {
        super(message, http_status_codes_1.StatusCodes.NOT_FOUND);
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends CustomError {
    constructor(message = http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR) {
        super(message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        this.name = "InternalServerError";
    }
}
exports.InternalServerError = InternalServerError;
