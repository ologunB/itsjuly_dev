"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.parseLocation = exports.catchAsync = exports.generateOTP = void 0;
const cloudinary_1 = require("cloudinary");
const generateOTP = (numDigits = 4) => {
    if (numDigits <= 0) {
        return "";
    }
    const min = Math.pow(10, numDigits - 1);
    const max = Math.pow(10, numDigits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
};
exports.generateOTP = generateOTP;
function catchAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
}
exports.catchAsync = catchAsync;
function parseLocation(location) {
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
exports.parseLocation = parseLocation;
function uploadImage(chunk) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader
                .upload_stream({ resource_type: "auto" }, // 'auto' will auto detect if it's an image, video, etc.
            (error, output) => {
                if (error || !output)
                    reject(error);
                else
                    resolve(output);
            })
                .end(chunk.buffer);
        });
        if (!result) {
            throw Error('Failed to upload image.');
        }
        return result;
    });
}
exports.uploadImage = uploadImage;
