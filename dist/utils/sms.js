"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilio_1 = __importDefault(require("twilio"));
const client = (0, twilio_1.default)(accountSid, authToken);
function sendSMS(to, body) {
    client.messages
        .create({
        body,
        messagingServiceSid: process.env.TWILIO_MSG_SERVICE_ID,
        to,
    })
        .then((message) => console.log(message));
}
exports.sendSMS = sendSMS;
