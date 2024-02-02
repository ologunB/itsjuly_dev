"use strict";
// user.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller")); // Adjust the path accordingly
const user_validation_1 = __importDefault(require("../validation/user.validation"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const fileUpload_1 = require("../middlewares/fileUpload");
const userRouter = express_1.default.Router();
userRouter.post("/register", user_validation_1.default.registrationValidation, user_controller_1.default.register);
userRouter.post("/resend-otp", user_validation_1.default.sendForgotPasswordValidation, user_controller_1.default.resendOTP);
userRouter.post("/verify", user_validation_1.default.verifyOTPValidation, user_controller_1.default.verifyAccount);
userRouter.post("/forgot-password/send", user_validation_1.default.sendForgotPasswordValidation, user_controller_1.default.sendForgotPassword);
userRouter.post("/forgot-password/verify", user_validation_1.default.verifyForgotPasswordValidation, user_controller_1.default.verifyForgotPassword);
userRouter.post("/forgot-password/confirm", user_validation_1.default.resetForgotPasswordValidation, user_controller_1.default.confirmForgotPassword);
userRouter.post("/login", user_validation_1.default.loginValidation, user_controller_1.default.login);
userRouter.post("/change-password", auth_middleware_1.isAuthenticated, user_validation_1.default.changePasswordValidation, user_controller_1.default.changePassword);
userRouter.put("/images", auth_middleware_1.isAuthenticated, fileUpload_1.uploadMultipleImage, user_controller_1.default.updateProfileImage);
userRouter.put("/update", auth_middleware_1.isAuthenticated, user_validation_1.default.updateAccountValidation, user_controller_1.default.updateProfile);
userRouter.put("/like", auth_middleware_1.isAuthenticated, user_validation_1.default.likeUserValidation, user_controller_1.default.likeUser);
userRouter.get("/me", auth_middleware_1.isAuthenticated, user_validation_1.default.emptyValidation, user_controller_1.default.getProfile);
userRouter.get("/all", auth_middleware_1.isAuthenticated, user_validation_1.default.emptyValidation, user_controller_1.default.getUsers);
userRouter.get("/utils", user_validation_1.default.emptyValidation, user_controller_1.default.getUtils);
userRouter.delete("/delete", auth_middleware_1.isAuthenticated, user_validation_1.default.deleteAccountValidation, user_controller_1.default.deleteAccount);
exports.default = userRouter;
