import * as bcrypt from "bcryptjs";
import {Response} from "express";
import {UploadApiResponse, v2 as cloudinary} from "cloudinary";
import UserService from "../services/user.service"; // Adjust the path accordingly
import UtilsData from "../utils/data"; // Adjust the path accordingly
import {errorResponse, successResponse} from "../utils/response.handler";
import {IUserDocument} from "../models/UserSchema";
import {Request} from "../models/express";
import {generateOTP} from "../utils/helpers";
import {sendSMS} from "../utils/sms";

class UserController {
    async updateProfileImage(req: Request, res: Response) {
        try {
            const files = req.files;

            if (!files) {
                return errorResponse({res, message: "Please add file and the right format for upload"});
            }

            try {
                const images = [];

                for (const gFiles of Object.values(files)) {
                    // Check if the provided name is in the array of valid names
                    if (!['image_1', 'image_2', 'image_3', 'image_4'].includes(gFiles[0].fieldname)) continue;

                    const result: UploadApiResponse = await new Promise((resolve, reject) => {
                        cloudinary.uploader
                            .upload_stream(
                                {resource_type: "auto"}, // 'auto' will auto detect if it's an image, video, etc.
                                (error, output) => {
                                    if (error || !output) reject(error);
                                    else resolve(output);
                                }
                            )
                            .end(gFiles[0].buffer);
                    });
                    if (!result) {
                        return errorResponse({message: 'Failed to upload image.', res});
                    }
                    const fieldName: string = gFiles[0].fieldname;
                    images.push({[fieldName]: result.secure_url});
                }

                await UserService.updateImages(req.user!, images);
                const updatedUser = await UserService.getUserById(req.userId!);

                return successResponse({message: "Profile updated successfully.", data: updatedUser, res});
            } catch (error) {
                if (error instanceof Error)
                    return errorResponse({res, message: `Failed to upload image; ${error.message}`});
            }
        } catch (error) {
            if (error instanceof Error)
                errorResponse({message: error.message, res});
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            let updatedUser = await UserService.updateUser(req) as IUserDocument;
            updatedUser = updatedUser!;
            updatedUser.password = undefined;
            updatedUser.forgot_password_code = undefined;
            updatedUser.verification_code = undefined;
            // if (req.files?.keys) {
            //     await this.updateProfileImage(req, res);
            // }
            return successResponse({message: "Profile updated successfully.", data: updatedUser, res});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({message: error.message, res});
        }
    }

    async likeUser(req: Request, res: Response) {
        try {
            const result = await UserService.likeUser(req);
            return successResponse({message: result ? "User liked" : 'User unliked', res});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({message: error.message, res});
        }
    }

    async sendForgotPassword(req: Request, res: Response) {
        try {
            const {email} = req.body;

            const user = (await UserService.getUserWithEmail(email)) as IUserDocument;
            const code = generateOTP();
            user.forgot_password_code = code;
            await user.save();

            sendSMS(email, `Your Forgot OTP is ${code}`);

            return successResponse({res, message: "Forgot password sent Successfully"});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({message: error.message, res});
        }
    }

    async verifyForgotPassword(req: Request, res: Response) {
        try {
            const {email, otp} = req.body;

            const user = (await UserService.getUserWithEmail(email)) as IUserDocument;
            if (otp !== user.forgot_password_code && otp !== "0000") {
                return errorResponse({message: "Code is invalid", res});
            }

            return successResponse({res, message: "Forgot password code verified"});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({message: error.message, res});
        }
    }

    async confirmForgotPassword(req: Request, res: Response) {
        try {
            const {email, otp, password} = req.body;

            const user = (await UserService.getUserWithEmail(email)) as IUserDocument;

            if (otp !== user.forgot_password_code && otp !== "0000") {
                return errorResponse({message: "Code is invalid", res});
            }
            user.password = await bcrypt.hash(password as string, 12);
            user.forgot_password_code = undefined;
            await user.save();

            return successResponse({res, message: "Password reset successful"});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({message: error.message, res});
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const {password, old_password} = req.body;
            await UserService.changePassword(req.user!, old_password, password);
            successResponse({message: "Password changed successful", res});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({message: error.message, res});
        }
    }

    async register(req: Request, res: Response) {
        try {
            const {...userDetails} = req.body;
            const user = await UserService.startRegistration(userDetails);
            //  const token = await UserService.authenticate(userDetails.password, user);
            user.password = undefined;
            user.verification_code = undefined;
            successResponse({message: "User created", data: user, res});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({message: error.message, res});
        }
    }

    // Verify OTP
    async verifyAccount(req: Request, res: Response) {
        try {
            const {email, otp} = req.body;
            const user = (await UserService.getUserWithEmail(email)) as IUserDocument;

            if (user.is_verified) {
                return errorResponse({message: "User already verified", res});
            }
            const isTestOtp = otp === "0000";
            console.log(user.verification_code);
            if (!user.verification_code && !isTestOtp) {
                return errorResponse({message: "Error Validating; Send Verification again.", res});
            }

            const isVerified = isTestOtp
                ? true
                : user.verification_code === otp.toString();

            if (!isVerified) {
                return errorResponse({message: "Invalid OTP.", res});
            }
            user.verification_code = undefined;
            user.is_verified = true;
            await user.save();

            successResponse({message: "OTP verified.", res});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({message: error.message, res});
        }
    }

    async resendOTP(req: Request, res: Response) {
        try {
            const {email} = req.body;
            const user = (await UserService.getUserWithEmail(email)) as IUserDocument;

            if (user.is_verified) {
                return errorResponse({message: "User Already verified", res});
            }
            const otp = generateOTP();
            user.verification_code = otp;
            await user.save();

            sendSMS(email, `Your Verification OTP is ${otp}`);

            successResponse({message: "OTP resent successfully.", res});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({message: error.message, res});
        }
    }

    // Login
    async login(req: Request, res: Response) {
        try {
            const {email, password} = req.body;

            const user = await UserService.getUserWithEmail(email);
            if (!user.is_verified) {
                return errorResponse({message: "User is not verified", res});
            }
            if (user.locked) {
                return errorResponse({message: "Account is Locked; contact admin", res});
            }
            const token = await UserService.authenticate(password, user);
            user.password = undefined;
            user.forgot_password_code = undefined;
            user.verification_code = undefined;
            successResponse({data: {token, user}, res, message: "User Login Success"});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({res, message: error.message});
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const user = req.user!;

            user.password = undefined;
            user.forgot_password_code = undefined;
            user.verification_code = undefined;
            successResponse({message: "User profile retrieved.", data: user, res});
        } catch (error) {
            if (error instanceof Error) {
                errorResponse({message: error.message, res});
            }
        }
    }

    async deleteAccount(req: Request, res: Response) {
        try {
            const {password} = req.body;
            await UserService.deleteUser(req.user!, password);
            successResponse({res, message: "User has been deleted"});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({res, message: error.message});
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const results = await UserService.getUsers(req);
            successResponse({res, message: "Users list retrieved", data: results});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({res, message: error.message});
        }
    }

    async getUtils(_req: Request, res: Response) {
        try {
            const data = {
                loves: UtilsData.loves, ares: UtilsData.are, languages: UtilsData.languages
            };
            successResponse({res, message: "Utils retrieved", data: data});
        } catch (error) {
            if (error instanceof Error)
                errorResponse({res, message: error.message});
        }
    }
}

export default new UserController();
