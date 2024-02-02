"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../utils/error");
const validate = (schema, source = "body") => {
    return (req, _res, next) => {
        const input = Object.assign({}, req[source]);
        const { error } = schema.validate(input);
        if (error) {
            next(new error_1.BadRequestError(error.details[0].message));
        }
        next();
    };
};
exports.default = validate;
