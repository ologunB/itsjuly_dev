// utils/jwt.utils.ts

import jwt from "jsonwebtoken";

export const generateToken = (userId: string): string => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET!, {expiresIn: "100d"});
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
};
