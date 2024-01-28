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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.userProjectionMin = exports.userProjection = exports.UserGender = exports.UserAgeGroup = exports.UserRole = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var UserRole;
(function (UserRole) {
    UserRole["User"] = "User";
    UserRole["Admin"] = "Admin";
    UserRole["SuperAdmin"] = "Super_Admin";
    UserRole["Family"] = "Family";
    UserRole["Volunteers"] = "Volunteers";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserAgeGroup;
(function (UserAgeGroup) {
    UserAgeGroup["18-25"] = "18-25";
    UserAgeGroup["26-35"] = "26-35";
    UserAgeGroup["36-45"] = "36-45";
    UserAgeGroup["46-55"] = "46-55";
    UserAgeGroup["56-65"] = "56-65";
    UserAgeGroup["66-75"] = "66-75";
    UserAgeGroup["76-85"] = "76-85";
    UserAgeGroup["86-95"] = "86-95";
    UserAgeGroup["96-105"] = "96-105";
})(UserAgeGroup || (exports.UserAgeGroup = UserAgeGroup = {}));
var UserGender;
(function (UserGender) {
    UserGender["male"] = "male";
    UserGender["female"] = "female";
})(UserGender || (exports.UserGender = UserGender = {}));
const userSchema = new mongoose_1.Schema({
    username: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    phone_number: { type: String },
    verification_code: { type: String },
    forgot_password_code: { type: String },
    is_verified: { type: Boolean, default: false },
    age_group: { type: String },
    locked: { type: Boolean, default: false },
    date_of_birth: Date,
    role: {
        type: String,
        enum: UserRole,
        default: UserRole.User,
    },
    bio: String,
    password: String,
    gender: {
        type: String,
        enum: UserGender,
    },
    address: String,
    city: String,
    state: String,
    zip: String,
    church_location: String,
    profile_image: {
        public_id: String,
        url: String,
    },
}, {
    timestamps: true, versionKey: false
});
exports.userProjection = {
    username: true,
    first_name: true,
    last_name: true,
    email: true,
    phone_number: true,
    is_verified: true,
    age_group: true,
    role: true,
    bio: true,
    gender: true,
    address: true,
    city: true,
    state: true,
    zip: true,
    church_location: true,
    profile_image: true,
};
exports.userProjectionMin = {
    username: true,
    first_name: true,
    last_name: true,
    state: true,
    profile_image: true,
    email: true,
    phone_number: true,
    gender: true,
    _id: true,
};
const UserModel = mongoose_1.default.model("User", userSchema);
exports.UserModel = UserModel;
