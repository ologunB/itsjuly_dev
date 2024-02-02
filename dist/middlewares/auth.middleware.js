"use strict";
// middlewares/auth.middleware.ts
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
exports.isAuthenticated = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const error_1 = require("../utils/error");
const user_service_1 = __importDefault(require("../services/user.service"));
const isAuthenticated = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
        return next(new error_1.UnauthorizedError("No authentication token provided."));
    }
    const token = authorizationHeader.split(" ")[1];
    try {
        const decoded = (0, jwt_utils_1.verifyToken)(token);
        const userId = decoded.id;
        const user = yield user_service_1.default.getUserById(userId);
        if (!user) {
            return next(new error_1.UnauthorizedError("User not found."));
        }
        req.user = user;
        req.userId = userId;
        next();
    }
    catch (error) {
        return next(new error_1.UnauthorizedError("Invalid or expired authentication token."));
    }
});
exports.isAuthenticated = isAuthenticated;
