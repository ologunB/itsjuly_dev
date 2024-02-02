"use strict";
// user.service.ts
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
const helpers_1 = require("../utils/helpers");
const sms_1 = require("../utils/sms");
class UserService {
    getUserWithEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield UserSchema_1.UserModel.findOne({ email }, { likes: 0 }));
            if (!user)
                throw new error_1.NotFoundError("User Not Found");
            return user;
        });
    }
    getUserById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield UserSchema_1.UserModel.findById(_id, { likes: 0 }));
            if (!user)
                throw new error_1.NotFoundError("User Not Found");
            return user;
        });
    }
    startRegistration(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = (yield UserSchema_1.UserModel.findOne({ email: userDetails.email })); // Cast to IUserDocument here
            if (user)
                throw new Error("User with the email already exists.");
            const password = yield bcryptjs_1.default.hash(userDetails.password, 12);
            let verificationCode = (0, helpers_1.generateOTP)();
            user = yield UserSchema_1.UserModel.create({
                email: userDetails.email,
                password: password,
                verification_code: verificationCode,
            });
            (0, sms_1.sendSMS)(userDetails.email, `Your Verification OTP is ${verificationCode}`);
            return (yield UserSchema_1.UserModel.findById(user.id));
        });
    }
    authenticate(password, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordCorrect) {
                throw new Error("Invalid password.");
            }
            return (0, jwt_utils_1.generateToken)(user.id);
        });
    }
    changePassword(user, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
            if (!isMatch)
                throw new Error("Old password is incorrect.");
            user.password = yield bcryptjs_1.default.hash(newPassword, 10); // hashing the new password
            yield user.save();
            return true;
        });
    }
    updateUser(req) {
        const userId = req.userId;
        let data = req.body;
        if (data.coordinates) {
            data.coordinates = {
                type: 'Point', coordinates: data.coordinates
            };
        }
        return UserSchema_1.UserModel.findOneAndUpdate({ _id: userId }, { $set: Object.assign({}, data) }, { new: true });
    }
    likeUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, like } = req.body;
            const liker = req.userId;
            yield this.getUserById(id);
            // const user = await UserModel.findOne({_id: id}, {likes: liker});
            if (like) {
                yield UserSchema_1.UserModel.findByIdAndUpdate(id, { $addToSet: { likes: liker } }, { new: true });
                return true;
            }
            else {
                yield UserSchema_1.UserModel.findByIdAndUpdate(id, { $pull: { likes: liker } }, { new: true });
                return false;
            }
        });
    }
    updateImages(user, images) {
        images = this.updateImageList(user.images || [], images);
        return UserSchema_1.UserModel.findOneAndUpdate({ _id: user.id }, { images: images }, { new: true });
    }
    updateImageList(formerImages, newImages) {
        const imagesMap = new Map();
        formerImages.forEach(imageObj => {
            Object.entries(imageObj).forEach(([key, value]) => {
                imagesMap.set(key, value);
            });
        });
        newImages.forEach(imageObj => {
            Object.entries(imageObj).forEach(([key, value]) => {
                imagesMap.set(key, value);
            });
        });
        return Array.from(imagesMap).map(([key, value]) => {
            return { [key]: value };
        });
    }
    deleteUser(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordCorrect) {
                throw new Error("Invalid password.");
            }
            yield UserSchema_1.UserModel.deleteOne({ _id: user.id });
        });
    }
    getUsers(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let { languages, location, parents, country_code, page } = req.query;
            const query = {};
            if (languages) {
                languages = (languages || '');
                const languagesArray = languages.split(',');
                query.languages = { $in: languagesArray };
            }
            if (location) {
                let parsed = (0, helpers_1.parseLocation)(location);
                if (location == 'around-me') {
                    const user = req.user;
                    query.location = {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: (_a = user.coordinates) === null || _a === void 0 ? void 0 : _a.coordinates
                            },
                            $maxDistance: 1000
                        }
                    };
                }
                else if (parsed) {
                    query.location = {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [parsed[0], parsed[1]]
                            },
                            $maxDistance: 1000
                        }
                    };
                }
            }
            if (parents)
                query.parents = parents;
            if (country_code)
                query.country_code = country_code;
            console.log(query);
            const pageSize = 20;
            page = (page || '1');
            const pageNumber = parseInt(page, 10);
            const offset = (pageNumber - 1) * pageSize;
            return UserSchema_1.UserModel.find(query, {
                password: 0,
                likes: 0,
                verification_code: 0,
                forgot_password_code: 0
            }).skip(offset).limit(pageSize);
        });
    }
}
exports.default = new UserService();
