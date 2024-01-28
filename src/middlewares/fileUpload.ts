import multer, {FileFilterCallback} from "multer";
import {Request} from "express";
import {BadRequestError} from "../utils/error";

const imageFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    // also allow pdf files
    const allowedImageTypes: string[] = ["png", "jpeg", "webp", "jpg", "pdf"];
    for (let mime of allowedImageTypes) {
        if (file.mimetype.includes(mime)) {
            return cb(null, true);
        }
    }
    cb(
        new BadRequestError(
            `Invalid Image/pdf; accepted images/pdf are: ${allowedImageTypes.join(
                ", "
            )}`
        )
    );
};

const videoFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    const allowedVideoTypes: string[] = [
        "mp4",
        "avi",
        "mov",
        "mkv",
        "3gp",
        "webm",
    ];

    for (let mime of allowedVideoTypes) {
        if (file.mimetype.includes(mime)) {
            return cb(null, true);
        }
    }

    cb(
        new BadRequestError(
            `Invalid Video; accepted videos are: ${allowedVideoTypes.join(", ")}`
        )
    );
};

const storage = multer.memoryStorage(); // Use memory storage instead of disk storage

const uploadImage = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
    },
}).single("image");

const uploadMultipleImage = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 20, // 20MB
    },
}).fields([
    {name: "image_1", maxCount: 1},
    {name: "image_2", maxCount: 1},
    {name: "image_3", maxCount: 1},
    {name: "image_4", maxCount: 1},
]);

const uploadVideo = multer({
    storage: storage,
    fileFilter: videoFilter,
    limits: {
        fileSize: 1024 * 1024 * 1000, // 1000MB
    },
}).single("video");

export {uploadImage, uploadVideo, uploadMultipleImage};
