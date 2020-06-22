import crypto from "crypto";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

export const hashFuction = (password) => {
    const encodedPw = crypto
        .createHash("sha512")
        .update(password + process.env.HASH)
        .digest("hex");
    return encodedPw;
};

function s4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return s4() + s4() + s4() + s4() + s4();
}

export const createUUID = () => {
    return guid();
};

export const sendMail = (address, secret) => {
    const transporter = nodemailer.createTransport(
        smtpTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        })
    );

    transporter.sendMail(
        {
            from: process.env.EMAIL_ADDRESS,
            to: address,
            subject: "COUPON PEOPLE EMAIL VALIATION!",
            html: `
            Click <a href="http://localhost:3000/users/verifyemail?key=${secret}">HERE</a> to verify your email!
            `,
        },
        (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        }
    );
};

export const sendResetMail = (address, secret) => {
    const transporter = nodemailer.createTransport(
        smtpTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        })
    );

    transporter.sendMail(
        {
            from: process.env.EMAIL_ADDRESS,
            to: address,
            subject: "COUPON PEOPLE PASSWORD RESET!",
            html: `
            Click <a href="http://localhost:3000/users/resetPassword?key=${secret}">HERE</a> to reset your email!
            `,
        },
        (err, info) => {
            if (err) {
                console.log(err);
            }
            console.log(info);
        }
    );
};
