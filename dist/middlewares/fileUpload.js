"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleImage = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const error_1 = require("../utils/error");
const imageFilter = (_req, file, cb) => {
    // also allow pdf files
    const allowedImageTypes = ["png", "jpeg", "webp", "jpg", "pdf"];
    for (let mime of allowedImageTypes) {
        if (file.mimetype.includes(mime)) {
            return cb(null, true);
        }
    }
    cb(new error_1.BadRequestError(`Invalid Image/pdf; accepted images/pdf are: ${allowedImageTypes.join(", ")}`));
};
const storage = multer_1.default.memoryStorage(); // Use memory storage instead of disk storage
const uploadImage = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
    },
}).single("image");
exports.uploadImage = uploadImage;
const uploadMultipleImage = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 20, // 20MB
    },
}).fields([
    { name: "image_1", maxCount: 1 },
    { name: "image_2", maxCount: 1 },
    { name: "image_3", maxCount: 1 },
    { name: "image_4", maxCount: 1 },
]);
exports.uploadMultipleImage = uploadMultipleImage;
