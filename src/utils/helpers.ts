import {NextFunction, Response} from "express";
import {Request} from "../models/express";

export const generateOTP = (numDigits = 4) => {
    if (numDigits <= 0) {
        return "";
    }

    const min = Math.pow(10, numDigits - 1);
    const max = Math.pow(10, numDigits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

export function catchAsync<T>(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
    return (req: Request, res: Response, next: NextFunction): void => {
        fn(req, res, next).catch((err) => next(err));
    };
}

export function parseLocation(location: string): string[] | undefined {
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