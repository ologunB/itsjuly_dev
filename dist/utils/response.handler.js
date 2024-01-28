"use strict";
// your-project-name/src/utils/responseHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const http_status_codes_1 = require("http-status-codes");
function successResponse(prop) {
    if (!prop.status)
        prop.status = http_status_codes_1.StatusCodes.OK;
    return prop.res.status(prop.status).json({
        success: true,
        message: prop.message,
        data: prop.data,
        meta: prop.meta,
    });
}
exports.successResponse = successResponse;
const errorResponse = ({ res, message, status, }) => {
    if (!status)
        status = http_status_codes_1.StatusCodes.BAD_REQUEST;
    return res.status(status).json({
        success: false,
        message,
    });
};
exports.errorResponse = errorResponse;
