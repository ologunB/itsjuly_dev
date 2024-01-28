// user.service.ts

import {IUser, IUserDocument, UserModel,} from "../models/UserSchema";
import bcrypt from "bcryptjs";
import {NotFoundError} from "../utils/error";
import {generateToken} from "../utils/jwt.utils";
import {generateOTP} from "../utils/helpers";
import {sendSMS} from "../utils/sms";
import {Request} from "../models/express";

class UserService {
    async getUserWithEmail(email: string) {
        const user = (await UserModel.findOne({email}, {likes: 0})) as IUserDocument;
        if (!user) throw new NotFoundError("User Not Found");
        return user;
    }

    async getUserById(_id: string) {
        const user = (await UserModel.findById(_id, {likes: 0})) as IUserDocument;
        console.log(1);
        if (!user) throw new NotFoundError("User Not Found");
        console.log(2);
        return user;
    }

    async startRegistration(userDetails: Partial<IUser>): Promise<IUserDocument> {
        let user = (await UserModel.findOne({email: userDetails.email})) as IUserDocument; // Cast to IUserDocument here
        if (user) throw new Error("User with the email already exists.");


        const password = await bcrypt.hash(userDetails.password as string, 12);
        let verificationCode = generateOTP();

        user = await UserModel.create({
            email: userDetails.email,
            password: password,
            verification_code: verificationCode,
        });
        sendSMS(userDetails.email!, `Your Verification OTP is ${verificationCode}`);

        return (await UserModel.findById(user.id)) as IUserDocument;
    }

    async authenticate(password: string, user: IUserDocument): Promise<string> {
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password as string
        );
        if (!isPasswordCorrect) {
            throw new Error("Invalid password.");
        }
        return generateToken(user.id);
    }

    async changePassword(user: IUserDocument, oldPassword: string, newPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(oldPassword, user.password as string);
        if (!isMatch) throw new Error("Old password is incorrect.");

        user.password = await bcrypt.hash(newPassword, 10); // hashing the new password
        await user.save();
        return true;
    }

    updateUser(req: Request) {
        const userId = req.userId!;
        return UserModel.findOneAndUpdate({_id: userId}, {$set: {...req.body}}, {new: true});
    }

    async likeUser(req: Request): Promise<boolean> {
        const {id, like} = req.body;
        const liker = req.userId!;
        const user = await this.getUserById(id);
        console.log(3);
        if (!user) throw new NotFoundError("User Not Found");
        console.log(4);

        // const user = await UserModel.findOne({_id: id}, {likes: liker});
        if (like) {
            await UserModel.findByIdAndUpdate(id, {$addToSet: {likes: liker}}, {new: true});
            return true;
        } else {
            await UserModel.findByIdAndUpdate(id, {$pull: {likes: liker}}, {new: true});
            return false;
        }
    }

    updateImages(user: IUserDocument, images: any) {
        images = this.updateImageList(user.images || [], images);
        return UserModel.findOneAndUpdate({_id: user.id}, {images: images}, {new: true});
    }

    updateImageList(formerImages: [], newImages: []) {
        const imagesMap = new Map<string, string>();

        formerImages.forEach(imageObj => {
            Object.entries(imageObj).forEach(([key, value]) => {
                imagesMap.set(key, value as string);
            });
        });

        newImages.forEach(imageObj => {
            Object.entries(imageObj).forEach(([key, value]) => {
                imagesMap.set(key, value as string);
            });
        });

        return Array.from(imagesMap).map(([key, value]) => {
            return {[key]: value as string};
        });
    }

    async deleteUser(user: IUserDocument, password: string) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password!);
        if (!isPasswordCorrect) {
            throw new Error("Invalid password.");
        }
        await UserModel.deleteOne({_id: user.id});
    }

    async getUsers(req: Request) {
        let {languages, location, parents, country_code} = req.query;
        const query: any = {};
        if (languages) {
            languages = (languages || '') as string;
            const languagesArray = languages.split(',');
            query.languages = {$in: languagesArray};
        }
        if (location) {
            let parsed: string[] | undefined = this.parseLocation(location as string);
            if (parsed) {
                query.location = {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parsed[0], parsed[1]]
                        },
                        $maxDistance: 1000
                    }
                }
            } else if (location == 'around-me') {
                const user = req.user!;
                query.location = {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: user.coordinates?.coordinates
                        },
                        $maxDistance: 1000
                    }
                }
            }
        }
        if (parents) query.parents = parents;
        if (country_code) query.country_code = country_code;

        console.log(query);
        return UserModel.find(query, {new: true});
    }

    parseLocation(location: string): string[] | undefined {
        // Check if location is in the format of "longitude,latitude"
        const coords = location.split(',');

        if (coords.length === 2) {
            const longitude = parseFloat(coords[0]);
            const latitude = parseFloat(coords[1]);

            // Check if both longitude and latitude are valid numbers
            if (!isNaN(longitude) && !isNaN(latitude)) {
                return coords;
            }
        }
        return undefined;
    }
}

export default new UserService();
