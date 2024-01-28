// user.routes.ts

import express from "express";
import UserController from "../controllers/user.controller"; // Adjust the path accordingly
import UserValidation from "../validation/user.validation";
import {isAuthenticated} from "../middlewares/auth.middleware";
import {uploadMultipleImage} from "../middlewares/fileUpload";

const userRouter = express.Router();

userRouter.post(
    "/register",
    UserValidation.registrationValidation,
    UserController.register
);
userRouter.post(
    "/resend-otp",
    UserValidation.sendForgotPasswordValidation,
    UserController.resendOTP
);
userRouter.post(
    "/verify",
    UserValidation.verifyOTPValidation,
    UserController.verifyAccount
);
userRouter.post(
    "/forgot-password/send",
    UserValidation.sendForgotPasswordValidation,
    UserController.sendForgotPassword
);
userRouter.post(
    "/forgot-password/verify",
    UserValidation.verifyForgotPasswordValidation,
    UserController.verifyForgotPassword
);
userRouter.post(
    "/forgot-password/confirm",
    UserValidation.resetForgotPasswordValidation,
    UserController.confirmForgotPassword
);

userRouter.post(
    "/login",
    UserValidation.loginValidation,
    UserController.login
);

userRouter.post(
    "/change-password",
    isAuthenticated,
    UserValidation.changePasswordValidation,
    UserController.changePassword
);

userRouter.put(
    "/images",
    isAuthenticated,
    uploadMultipleImage,
    UserController.updateProfileImage
);

userRouter.put(
    "/update",
    isAuthenticated,
    UserValidation.updateAccountValidation,
    UserController.updateProfile
);

userRouter.put(
    "/like",
    isAuthenticated,
    UserValidation.likeUserValidation,
    UserController.likeUser
);

userRouter.get(
    "/me",
    isAuthenticated,
    UserValidation.emptyValidation,
    UserController.getProfile
);

userRouter.get(
    "/all",
    isAuthenticated,
    UserValidation.emptyValidation,
    UserController.getUsers
);

userRouter.get(
    "/utils",
    UserValidation.emptyValidation,
    UserController.getUtils
);

userRouter.delete(
    "/delete",
    isAuthenticated,
    UserValidation.deleteAccountValidation,
    UserController.deleteAccount
);

export default userRouter;
