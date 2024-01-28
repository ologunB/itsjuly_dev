"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.catchAsync = exports.USPhoneNumberPattern = void 0;
exports.USPhoneNumberPattern = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$|^(\+1\s?)?\d{10}$/;
function catchAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
}
exports.catchAsync = catchAsync;
const generateOTP = (numDigits = 4) => {
    if (numDigits <= 0) {
        return "";
    }
    const min = Math.pow(10, numDigits - 1);
    const max = Math.pow(10, numDigits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
};
exports.generateOTP = generateOTP;
