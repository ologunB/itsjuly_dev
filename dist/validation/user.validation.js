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
const updateProfileSchema = joi_1.default.object({
    first_name: joi_1.default.string(),
    last_name: joi_1.default.string(),
    age_group: joi_1.default.string(),
    date_of_birth: joi_1.default.date(),
    bio: joi_1.default.string().optional(),
    address: joi_1.default.string(),
    city: joi_1.default.string(),
    state: joi_1.default.string(),
    zip: joi_1.default.string(),
    church_location: joi_1.default.string(),
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
    forgot_password_code: joi_1.default.string().length(4).required(),
});
const resetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    forgot_password_code: joi_1.default.string().length(4).required(),
    password: joi_1.default.string().required(),
});
const changePasswordSchema = joi_1.default.object({
    password: joi_1.default.string().required(),
    old_password: joi_1.default.string().required(),
});
exports.default = {
    verifyOTPValidation: (0, validate_1.default)(verifyOTPSchema),
    registrationValidation: (0, validate_1.default)(registrationSchema),
    loginValidation: (0, validate_1.default)(loginSchema),
    changePasswordValidation: (0, validate_1.default)(changePasswordSchema),
    sendForgotPasswordValidation: (0, validate_1.default)(sendForgotPasswordSchema),
    verifyForgotPasswordValidation: (0, validate_1.default)(verifyForgotPasswordSchema),
    resetForgotPasswordValidation: (0, validate_1.default)(resetPasswordSchema),
    updateProfileSchema: (0, validate_1.default)(updateProfileSchema),
};
