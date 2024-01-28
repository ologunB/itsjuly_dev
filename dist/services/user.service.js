"use strict";
// user.service.ts
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
const UserSchema_1 = require("../models/UserSchema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const error_1 = require("../utils/error");
const jwt_utils_1 = require("../utils/jwt.utils");
const axios_1 = __importStar(require("axios"));
const pagination_utils_1 = require("../utils/pagination.utils");
const helpers_1 = require("../utils/helpers");
const nodemailer_1 = __importDefault(require("nodemailer"));
class UserService {
    // 1. Register a user with phone number
    getUserWithEmail(email, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield UserSchema_1.UserModel.findOne({ email }));
            if (!user && next)
                return next(new error_1.NotFoundError("User Not Found"));
            return user;
        });
    }
    getUserById(_id, next, showPassword = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield UserSchema_1.UserModel.findById(_id));
            if (!user && next)
                return next(new error_1.NotFoundError("User Not Found"));
            if (!showPassword)
                user.password = undefined;
            return user;
        });
    }
    // 2. Sending OTP to the user's phone number
    // Note: This is a mock function. In real-world scenarios, you'd integrate with an SMS service.
    sendOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                service: "Gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "logunbabatope@gmail.com",
                    pass: "gydp xqwe nvsi eili",
                },
            });
            const mailOptions = {
                from: "logunbabatope@gmail.com",
                to: email,
                subject: 'Email OTP verification',
                html: `Your OTP is ${otp}`
            };
            console.log(otp);
            transporter === null || transporter === void 0 ? void 0 : transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Verify email sent: ' + info.response);
                }
            });
        });
    }
    // 3. Verify OTP
    // Note: You'll have to store the OTP sent to the user in some temporary storage like Redis or in-memory cache.
    verifyOTP(otp, otp_token) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let _data = {
                pin_id: otp_token,
                pin: otp,
                api_key: process.env.TERMII_API_KEY,
            };
            try {
                const { data } = (yield axios_1.default.post("https://api.ng.termii.com/api/sms/otp/verify", _data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }));
                if ((data === null || data === void 0 ? void 0 : data.verified) === true) {
                    return true;
                }
                return false;
            }
            catch (e) {
                if (e instanceof axios_1.AxiosError) {
                    throw new error_1.BadRequestError(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data.message) || ((_b = e.response) === null || _b === void 0 ? void 0 : _b.data.verified));
                }
            }
        });
    }
    // 4. Complete Registration
    startRegistration(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = (yield UserSchema_1.UserModel.findOne({ email: userDetails.email })); // Cast to IUserDocument here
            if (user) {
                throw new Error("User with the email already exists.");
            }
            const password = yield bcryptjs_1.default.hash(userDetails.password, 12);
            let verificationCode = (0, helpers_1.generateOTP)();
            user = yield UserSchema_1.UserModel.create({
                email: userDetails.email,
                verification_code: verificationCode, password,
            });
            return (yield UserSchema_1.UserModel.findById(user._id));
        });
    }
    // 5. Basic Authentication (Login)
    authenticate(password, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordCorrect) {
                throw new Error("Invalid password.");
            }
            const token = (0, jwt_utils_1.generateToken)(user.id);
            return token;
        });
    }
    changePassword(user, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
            if (!isMatch) {
                throw new Error("Old password is incorrect.");
            }
            user.password = yield bcryptjs_1.default.hash(newPassword, 10); // hashing the new password
            yield user.save();
            return true;
        });
    }
    updateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            if (!user)
                throw new Error("User not found.");
            return (yield UserSchema_1.UserModel.findOneAndUpdate({
                _id: user._id,
            }, {
                $set: data,
            }, {
                new: true,
            }));
        });
    }
    getAllUsers({ page, limit, gender, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterQuery = {
                role: UserSchema_1.UserRole.User,
                first_name: { $exists: true },
            };
            if (gender)
                filterQuery.gender = gender;
            const projection = { password: 0 }; // Exclude the password field from the results
            // Calling the paginate function with the necessary arguments
            const paginatedResult = yield (0, pagination_utils_1.paginate)({
                model: UserSchema_1.UserModel,
                filterQuery,
                page,
                limit,
                projection,
            });
            return paginatedResult;
        });
    }
    getAllAdmins({ page, limit, gender, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterQuery = {
                role: { $ne: UserSchema_1.UserRole.User },
                first_name: { $exists: true },
            };
            if (gender)
                filterQuery.gender = gender;
            const projection = { password: 0 }; // Exclude the password field from the results
            // Calling the paginate function with the necessary arguments
            const paginatedResult = yield (0, pagination_utils_1.paginate)({
                model: UserSchema_1.UserModel,
                filterQuery,
                page,
                limit,
                projection,
            });
            return paginatedResult;
        });
    }
    lockUser(userId, isLocked) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            if (!user)
                throw new Error("User not found.");
            yield UserSchema_1.UserModel.updateOne({ _id: user._id }, { $set: { locked: isLocked ? true : false } });
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            if (!user)
                throw new Error("User not found.");
            yield UserSchema_1.UserModel.deleteOne({ _id: user._id });
        });
    }
    getAllUsersMobile() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSchema_1.UserModel.find({ role: UserSchema_1.UserRole.User, first_name: { $exists: true } }, UserSchema_1.userProjectionMin);
        });
    }
    getAllUserCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSchema_1.UserModel.countDocuments();
        });
    }
}
exports.default = new UserService();
