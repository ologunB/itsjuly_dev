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
exports.UserModel = exports.UserGender = exports.UserRole = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var UserRole;
(function (UserRole) {
    UserRole["User"] = "User";
    UserRole["Admin"] = "Admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserGender;
(function (UserGender) {
    UserGender["male"] = "male";
    UserGender["female"] = "female";
})(UserGender || (exports.UserGender = UserGender = {}));
const userSchema = new mongoose_1.Schema({
    first_name: String,
    last_name: String,
    parents: String,
    children: {
        type: [new mongoose_1.Schema({
                dob: { type: Date, required: true },
                gender: { type: String, enum: ['male', 'female'], required: true }
            })],
        default: undefined
    },
    location: String,
    images: { type: [], default: undefined },
    languages: { type: [String], default: undefined },
    tags_are: { type: [String], default: undefined },
    tags_love: { type: [String], default: undefined },
    likes: { type: [String], default: undefined },
    description: String,
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
    country_code: String,
    email: { type: String, required: true },
    password: { type: String },
    role: {
        type: String,
        enum: UserRole,
        default: UserRole.User,
    },
    is_verified: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    verification_code: String,
    forgot_password_code: String
}, {
    timestamps: true, versionKey: false
});
const UserModel = mongoose_1.default.model("User", userSchema);
exports.UserModel = UserModel;
