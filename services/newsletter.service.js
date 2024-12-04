import nodemailer from 'nodemailer';
import log4js from 'log4js';
const log = log4js.getLogger("service:Newsletter");
log.level = "debug";

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

const sendNewsletter = (email, subject, content) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            log.error(error);
        } else {
            log.info('Newsletter sent: ' + info.response);
        }
    });
};

export { sendNewsletter };