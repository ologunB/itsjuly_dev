import {NextFunction, Response} from "express";
import {Request} from "../models/express";
import {UploadApiResponse, v2 as cloudinary} from "cloudinary";

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

export async function uploadImage(chunk: Express.Multer.File): Promise<UploadApiResponse> {
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {resource_type: "auto"}, // 'auto' will auto detect if it's an image, video, etc.
                (error, output) => {
                    if (error || !output) reject(error);
                    else resolve(output);
                }
            )
            .end(chunk.buffer);
    });
    if (!result) {
        throw Error('Failed to upload image.');
    }
    return result;
}