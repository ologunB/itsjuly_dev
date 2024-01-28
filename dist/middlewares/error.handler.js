"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalError = exports.notFound = void 0;
const appError_1 = require("./appError");
// 404 - Not Found Middleware
const notFound = (req, res, next) => {
    const error = new appError_1.AppError("Page Not Found", 404);
    next(error);
};
exports.notFound = notFound;
// General Error Handling Middleware
const generalError = (error, req, res, next) => {
    console.log({ error });
    const status = error.status || error.status || 500;
    let message = "Internal Server Error";
    message = error.message || message;
    // Log the error for developer's insight
    console.error(`[${req.method} ${req.url}] ${message} `);
    if (error.status > 499)
        console.log(`${error.stack}`);
    // Respond with error
    res.status(status).json({
        success: false,
        message,
    });
};
exports.generalError = generalError;
