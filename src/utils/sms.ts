import nodemailer from "nodemailer";

export function sendSMS(email: string, message: string) {
    const transporter = nodemailer.createTransport({
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
    transporter?.sendMail(mailOptions, (error: any, info: { response: string; }) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Verify email sent: ' + info.response);
        }
    });
}
