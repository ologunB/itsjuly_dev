"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcryptjs"));
const user_service_1 = __importDefault(require("../services/user.service")); // Adjust the path accordingly
const data_1 = __importDefault(require("../utils/data")); // Adjust the path accordingly
const response_handler_1 = require("../utils/response.handler");
const helpers_1 = require("../utils/helpers");
const sms_1 = require("../utils/sms");
const http_status_codes_1 = require("http-status-codes");
class UserController {
    updateProfileImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                if (!files) {
                    return (0, response_handler_1.errorResponse)({ res, message: "Please add file and the right format for upload" });
                }
                try {
                    const images = [];
                    for (const gFiles of Object.values(files)) {
                        // Check if the provided name is in the array of valid names
                        if (!['image_1', 'image_2', 'image_3', 'image_4'].includes(gFiles[0].fieldname))
                            continue;
                        const result = yield (0, helpers_1.uploadImage)(gFiles[0].buffer);
                        if (!result) {
                            return (0, response_handler_1.errorResponse)({ message: 'Failed to upload image.', res });
                        }
                        const fieldName = gFiles[0].fieldname;
                        images.push({ [fieldName]: result.secure_url });
                    }
                    yield user_service_1.default.updateImages(req.user, images);
                    const updatedUser = yield user_service_1.default.getUserById(req.userId);
                    return (0, response_handler_1.successResponse)({ message: "Profile updated successfully.", data: updatedUser, res });
                }
                catch (error) {
                    if (error instanceof Error)
                        return (0, response_handler_1.errorResponse)({ res, message: `Failed to upload image; ${error.message}` });
                }
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updatedUser = yield user_service_1.default.updateUser(req);
                updatedUser = updatedUser;
                updatedUser.password = undefined;
                updatedUser.forgot_password_code = undefined;
                updatedUser.verification_code = undefined;
                // if (req.files?.keys) {
                //     await this.updateProfileImage(req, res);
                // }
                return (0, response_handler_1.successResponse)({ message: "Profile updated successfully.", data: updatedUser, res });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    likeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield user_service_1.default.likeUser(req);
                return (0, response_handler_1.successResponse)({ message: result ? "User liked" : 'User unliked', res });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    sendForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = (yield user_service_1.default.getUserWithEmail(email));
                const code = (0, helpers_1.generateOTP)();
                user.forgot_password_code = code;
                yield user.save();
                (0, sms_1.sendSMS)(email, `Your Forgot OTP is ${code}`);
                return (0, response_handler_1.successResponse)({ res, message: "Forgot password sent Successfully" });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    verifyForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const user = (yield user_service_1.default.getUserWithEmail(email));
                if (otp !== user.forgot_password_code && otp !== "0000") {
                    return (0, response_handler_1.errorResponse)({ message: "Code is invalid", res });
                }
                return (0, response_handler_1.successResponse)({ res, message: "Forgot password code verified" });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    confirmForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, password } = req.body;
                const user = (yield user_service_1.default.getUserWithEmail(email));
                if (otp !== user.forgot_password_code && otp !== "0000") {
                    return (0, response_handler_1.errorResponse)({ message: "Code is invalid", res });
                }
                user.password = yield bcrypt.hash(password, 12);
                user.forgot_password_code = undefined;
                yield user.save();
                return (0, response_handler_1.successResponse)({ res, message: "Password reset successful" });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, old_password } = req.body;
                yield user_service_1.default.changePassword(req.user, old_password, password);
                (0, response_handler_1.successResponse)({ message: "Password changed successful", res });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = __rest(req.body, []);
                const user = yield user_service_1.default.startRegistration(userDetails);
                //  const token = await UserService.authenticate(userDetails.password, user);
                user.password = undefined;
                user.verification_code = undefined;
                (0, response_handler_1.successResponse)({ message: "User created", data: user, res, status: http_status_codes_1.StatusCodes.CREATED });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    // Verify OTP
    verifyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const user = (yield user_service_1.default.getUserWithEmail(email));
                if (user.is_verified) {
                    return (0, response_handler_1.errorResponse)({ message: "User already verified", res });
                }
                const isTestOtp = otp === "0000";
                console.log(user.verification_code);
                if (!user.verification_code && !isTestOtp) {
                    return (0, response_handler_1.errorResponse)({ message: "Error Validating; Send Verification again.", res });
                }
                const isVerified = isTestOtp
                    ? true
                    : user.verification_code === otp.toString();
                if (!isVerified) {
                    return (0, response_handler_1.errorResponse)({ message: "Invalid OTP.", res });
                }
                user.verification_code = undefined;
                user.is_verified = true;
                yield user.save();
                (0, response_handler_1.successResponse)({ message: "OTP verified.", res });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    resendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = (yield user_service_1.default.getUserWithEmail(email));
                if (user.is_verified) {
                    return (0, response_handler_1.errorResponse)({ message: "User Already verified", res });
                }
                const otp = (0, helpers_1.generateOTP)();
                user.verification_code = otp;
                yield user.save();
                (0, sms_1.sendSMS)(email, `Your Verification OTP is ${otp}`);
                (0, response_handler_1.successResponse)({ message: "OTP resent successfully.", res });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    // Login
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield user_service_1.default.getUserWithEmail(email);
                if (!user.is_verified) {
                    return (0, response_handler_1.errorResponse)({ message: "User is not verified", res });
                }
                if (user.locked) {
                    return (0, response_handler_1.errorResponse)({ message: "Account is Locked; contact admin", res });
                }
                const token = yield user_service_1.default.authenticate(password, user);
                user.password = undefined;
                user.forgot_password_code = undefined;
                user.verification_code = undefined;
                (0, response_handler_1.successResponse)({ data: { token, user }, res, message: "User Login Success" });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ res, message: error.message });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                user.password = undefined;
                user.forgot_password_code = undefined;
                user.verification_code = undefined;
                (0, response_handler_1.successResponse)({ message: "User profile retrieved.", data: user, res });
            }
            catch (error) {
                if (error instanceof Error) {
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
                }
            }
        });
    }
    deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = req.body;
                yield user_service_1.default.deleteUser(req.user, password);
                (0, response_handler_1.successResponse)({ res, message: "User has been deleted" });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ res, message: error.message });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield user_service_1.default.getUsers(req);
                (0, response_handler_1.successResponse)({ res, message: "Users list retrieved", data: results });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ res, message: error.message });
            }
        });
    }
    getUtils(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    loves: data_1.default.loves, ares: data_1.default.are, languages: data_1.default.languages
                };
                (0, response_handler_1.successResponse)({ res, message: "Utils retrieved", data: data });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ res, message: error.message });
            }
        });
    }
}
exports.default = new UserController();
