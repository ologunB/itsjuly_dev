// middlewares/auth.middleware.ts

import {NextFunction, Response} from "express";
import {verifyToken} from "../utils/jwt.utils";
import {UnauthorizedError} from "../utils/error";
import UserService from "../services/user.service";
import {Request} from "../models/express";

export const isAuthenticated = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
        return next(new UnauthorizedError("No authentication token provided."));
    }

    const token = authorizationHeader.split(" ")[1];
    try {
        const decoded = verifyToken(token);

        const userId = decoded.id;
        const user = await UserService.getUserById(userId);
        if (!user) {
            return next(new UnauthorizedError("User not found."));
        }
        req.user = user;
        req.userId = userId;
        next();
    } catch (error) {
        return next(
            new UnauthorizedError("Invalid or expired authentication token.")
        );
    }
};