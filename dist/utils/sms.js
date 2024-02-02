"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendSMS(email, message) {
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "logunbabatope@gmail.com",
            pass: "gydp xqwe nvsi eili",
        },
    });
    const mailOptions = {
        from: "logunbabatope@gmail.com",
        to: email,
        subject: 'Email OTP verification',
        html: message
    };
    console.log(message);
    transporter === null || transporter === void 0 ? void 0 : transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Verify email sent: ' + info.response);
        }
    });
}
exports.sendSMS = sendSMS;
