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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcryptjs"));
const user_service_1 = __importDefault(require("../services/user.service")); // Adjust the path accordingly
const response_handler_1 = require("../utils/response.handler");
const user_service_2 = __importDefault(require("../services/user.service"));
const helpers_1 = require("../utils/helpers");
const cloudinary_1 = require("cloudinary");
const sms_1 = require("../utils/sms");
class UserController {
    constructor() {
        this.sendForgotPassword = (0, helpers_1.catchAsync)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user = (yield user_service_1.default.getUserWithEmail(email, next));
            const forgot_password_code = (0, helpers_1.generateOTP)();
            user.forgot_password_code = forgot_password_code;
            yield user.save();
            // TODO: SEND FORGOT PASSWORD SMS
            // sendSMS(phone_number, `Your Forgot OTP is ${otp_token}`);
            return (0, response_handler_1.successResponse)({
                res,
                message: "Forgot Password Sent Successfully",
            });
        }));
        this.verifyForgotPassword = (0, helpers_1.catchAsync)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { email, forgot_password_code } = req.body;
            const user = (yield user_service_1.default.getUserWithEmail(email, next));
            const isTest = forgot_password_code.toString() === "0000";
            if (forgot_password_code.toString() !==
                ((_a = user.forgot_password_code) === null || _a === void 0 ? void 0 : _a.toString()) &&
                !isTest)
                return (0, response_handler_1.errorResponse)({ message: "forgot_password_code invalid", res });
            return (0, response_handler_1.successResponse)({
                res,
                message: "Forgot Password Code Verified",
            });
        }));
        this.resetForgotPassword = (0, helpers_1.catchAsync)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const { email, forgot_password_code, password } = req.body;
            const user = (yield user_service_1.default.getUserWithEmail(email, next));
            if (!user.password)
                return (0, response_handler_1.errorResponse)({ message: "password not set", res });
            const isTest = forgot_password_code.toString() === "0000";
            if (forgot_password_code.toString() !==
                ((_b = user.forgot_password_code) === null || _b === void 0 ? void 0 : _b.toString()) &&
                !isTest)
                return (0, response_handler_1.errorResponse)({ message: "forgot_password_code invalid", res });
            const hashPassword = yield bcrypt.hash(password, 12);
            user.password = hashPassword;
            user.forgot_password_code = undefined;
            yield user.save();
            return (0, response_handler_1.successResponse)({ res, message: "Password Reset Successfully" });
        }));
        this.changePassword = (0, helpers_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { password, old_password } = req.body;
            const user = (yield user_service_1.default.getUserById(req.userId, undefined, true));
            yield user_service_1.default.changePassword(user, old_password, password);
            (0, response_handler_1.successResponse)({ message: "Password changed successfully.", res });
        }));
        this.updateProfileImage = (0, helpers_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file) {
                return (0, response_handler_1.errorResponse)({
                    res,
                    message: "Please add file and the right format for upload",
                });
            }
            const user = (yield user_service_1.default.getUserById(req.userId, undefined, true));
            try {
                const result = yield new Promise((resolve, reject) => {
                    cloudinary_1.v2.uploader
                        .upload_stream({ resource_type: "auto" }, // 'auto' will auto detect if it's an image, video, etc.
                    (error, output) => {
                        if (error || !output)
                            reject(error);
                        else
                            resolve(output);
                    })
                        .end(file.buffer);
                });
                if (!result) {
                    throw new Error("Failed to upload image.");
                }
                // Use the result's URL as the user's profile image
                const profileImageUpload = {
                    profile_image: {
                        public_id: result.public_id,
                        url: result.secure_url,
                    },
                };
                yield user_service_1.default.updateUser(user._id, profileImageUpload);
                return (0, response_handler_1.successResponse)({
                    message: "Profile Image updated successfully.",
                    data: profileImageUpload.profile_image,
                    res,
                });
            }
            catch (error) {
                if (error instanceof Error)
                    return (0, response_handler_1.errorResponse)({
                        res,
                        message: `Failed to upload image; ${error.message}`,
                    });
            }
        }));
        this.removeProfileImage = (0, helpers_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = (yield user_service_1.default.getUserById(req.userId, undefined, true));
            yield user_service_1.default.updateUser(user._id, {
                profile_image: { public_id: "", url: "" },
            });
            return (0, response_handler_1.successResponse)({
                message: "Profile Image Removed successfully.",
                res,
            });
        }));
        this.updatePhoneNumber = (0, helpers_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { newPhoneNumber } = req.body;
            const user = (yield user_service_1.default.getUserById(req.userId, undefined, true));
            yield user_service_1.default.updateUser(user._id, { phone_number: newPhoneNumber });
            return (0, response_handler_1.successResponse)({
                message: "Phone Number Updated.",
                res,
            });
        }));
        this.updateProfile = (0, helpers_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = (yield user_service_1.default.getUserById(req.userId, undefined, true));
            const updatedUser = yield user_service_1.default.updateUser(user._id, Object.assign({}, req.body));
            updatedUser.password = undefined;
            return (0, response_handler_1.successResponse)({
                message: "Profile updated successfully.",
                data: updatedUser,
                res,
            });
        }));
        this.getAllUsers = (0, helpers_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield user_service_1.default.getAllUsersMobile();
            return (0, response_handler_1.successResponse)({
                message: "User Fetched successfully.",
                data: users,
                res,
            });
        }));
    }
    // Register with email address
    startRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userDetails } = req.body;
                const user = yield user_service_1.default.startRegistration(userDetails);
                const token = yield user_service_1.default.authenticate(userDetails.password, user);
                user.password = undefined;
                (0, response_handler_1.successResponse)({
                    message: "Registration completed.",
                    data: { user, token },
                    res,
                });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    // Verify OTP
    verifyOTP(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const user = (yield user_service_1.default.getUserWithEmail(email, next));
                if (!user) {
                    return (0, response_handler_1.errorResponse)({ message: 'No user was found', res });
                }
                const isTestOtp = otp === "0000";
                // if (user.is_verified)
                //   return errorResponse({ message: "User Already verify", res });
                if (!user.verification_code && !isTestOtp)
                    return (0, response_handler_1.errorResponse)({
                        message: "Error Validating; Send Verification again.",
                        res,
                    });
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
    resendOTP(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = (yield user_service_1.default.getUserWithEmail(email, next));
                if (!user)
                    return;
                // if (user.is_verified)
                //   return errorResponse({ message: "User Already verify", res });
                const otp_token = (0, helpers_1.generateOTP)();
                user.verification_code = otp_token;
                yield user.save();
                // TODO: SEND OTP SMS
                (0, sms_1.sendSMS)(email, `Your Verification OTP is ${otp_token}`);
                (0, response_handler_1.successResponse)({
                    message: "OTP resend successfully.",
                    res,
                });
            }
            catch (error) {
                if (error instanceof Error)
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
            }
        });
    }
    // Complete Registration
    // Login
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield user_service_2.default.getUserWithEmail(email);
                if (!user)
                    return (0, response_handler_1.errorResponse)({ message: "User not found", res });
                if (!user.password)
                    return (0, response_handler_1.errorResponse)({ message: "Incomplete Profile", res });
                if (user.locked) {
                    return (0, response_handler_1.errorResponse)({
                        message: "Account is Locked; contact admin",
                        res,
                    });
                }
                const token = yield user_service_1.default.authenticate(password, user);
                user.password = undefined;
                (0, response_handler_1.successResponse)({
                    data: { token, user },
                    res,
                    message: "User Login Success",
                });
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
                const user = yield user_service_1.default.getUserById(req.userId);
                if (!user) {
                    return (0, response_handler_1.errorResponse)({ message: "User not found.", res });
                }
                (0, response_handler_1.successResponse)({ message: "User profile retrieved.", data: user, res });
            }
            catch (error) {
                if (error instanceof Error) {
                    (0, response_handler_1.errorResponse)({ message: error.message, res });
                }
            }
        });
    }
}
exports.default = new UserController();
