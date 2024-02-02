"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validate_1 = __importDefault(require("./validate"));
const registrationSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
});
const verifyOTPSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().length(4).required(),
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
const sendForgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
const verifyForgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().length(4).required(),
});
const resetForgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().length(4).required(),
    password: joi_1.default.string().required(),
});
const changePasswordSchema = joi_1.default.object({
    password: joi_1.default.string().required(),
    old_password: joi_1.default.string().required(),
});
const emptySchema = joi_1.default.object({});
const updateAccountSchema = joi_1.default.object({
    first_name: joi_1.default.string(),
    last_name: joi_1.default.string(),
    parents: joi_1.default.string(),
    children: joi_1.default.array().items(joi_1.default.object({
        dob: joi_1.default.date().required(),
        gender: joi_1.default.string().valid('male', 'female').required()
    })),
    location: joi_1.default.string(),
    languages: joi_1.default.array().items(joi_1.default.string()),
    tags_are: joi_1.default.array().items(joi_1.default.string()),
    tags_love: joi_1.default.array().items(joi_1.default.string()),
    description: joi_1.default.string(),
    coordinates: joi_1.default.array().items(joi_1.default.number(), joi_1.default.number()).length(2).required(),
    country_code: joi_1.default.string(),
});
const deleteAccountSchema = joi_1.default.object({
    password: joi_1.default.string().required()
});
const likeUserSchema = joi_1.default.object({
    id: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
        "any.required": "User ID is required",
        "string.pattern.base": "User ID is not a valid ObjectID",
    }),
    like: joi_1.default.boolean().required()
});
exports.default = {
    registrationValidation: (0, validate_1.default)(registrationSchema),
    verifyOTPValidation: (0, validate_1.default)(verifyOTPSchema),
    loginValidation: (0, validate_1.default)(loginSchema),
    sendForgotPasswordValidation: (0, validate_1.default)(sendForgotPasswordSchema),
    verifyForgotPasswordValidation: (0, validate_1.default)(verifyForgotPasswordSchema),
    resetForgotPasswordValidation: (0, validate_1.default)(resetForgotPasswordSchema),
    emptyValidation: (0, validate_1.default)(emptySchema),
    changePasswordValidation: (0, validate_1.default)(changePasswordSchema),
    updateAccountValidation: (0, validate_1.default)(updateAccountSchema),
    deleteAccountValidation: (0, validate_1.default)(deleteAccountSchema),
    likeUserValidation: (0, validate_1.default)(likeUserSchema),
};
