const nodemailer = require("nodemailer");
const env = require("../config/env.config");

const sendMail = async (user) => {
    const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST, port: env.SMTP_PORT,
        secure: false, auth: {
            user: env.SMTP_MAIL, pass: env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        form: env.SMTP_MAIL, to: user.email, subject: "Xác thực tài khoản", html: user.html,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
