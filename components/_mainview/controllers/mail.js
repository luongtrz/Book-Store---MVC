'use strict';

const Mailjet = require('node-mailjet');

// Cấu hình cứng các giá trị
const mailjetConfig = {
    publicKey: "f6427e28f5ddcf579c4c536dc8d32179", // Giá trị từ MJ_APIKEY_PUBLIC
    privateKey: "112d5281f80f5306556b51aa91cebc1f", // Giá trị từ MJ_APIKEY_PRIVATE
    senderEmail: "vungoca396@gmail.com",
    senderName: "BookShop",
};

function sendForgotPasswordEmail(user, host, resetLink) {
    const mailjet = Mailjet.apiConnect(
        mailjetConfig.publicKey, // Sử dụng giá trị cứng
        mailjetConfig.privateKey // Sử dụng giá trị cứng
    );
    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: mailjetConfig.senderEmail,
                        Name: mailjetConfig.senderName,
                    },
                    To: [
                        {
                            Email: user.email,
                            Name: `${user.firstName} ${user.lastName}`,
                        },
                    ],
                    Subject: "[BookShop] Reset your password",
                    HTMLPart: `
                        <p>Hi ${user.firstName} ${user.lastName}, </p>
                        <p>You recently requested to reset the password for your [customer portal] account. Click the button below to proceed. </p>
                        
                        <p> Click link to reset password: 
                            <a href="${resetLink}">Reset password</a> 
                        </p>
                        <p>
                            If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 30 minutes.
                        </p>

                        <p>
                            Thanks
                        </p>`
                },
            ],
        });
    return request
        .then((result) => {
            return result.body;
        })
        .catch((error) => {
            throw error;
        });
}

function sendActivateEmail(user, host, activateLink) {
    const mailjet = Mailjet.apiConnect(
        mailjetConfig.publicKey, // Sử dụng giá trị cứng
        mailjetConfig.privateKey // Sử dụng giá trị cứng
    );
    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: mailjetConfig.senderEmail,
                        Name: mailjetConfig.senderName,
                    },
                    To: [
                        {
                            Email: user.email,
                            Name: `${user.firstName} ${user.lastName}`,
                        },
                    ],
                    Subject: "[BookShop] Activate your account",
                    HTMLPart: `
                        <p>Hi ${user.firstName} ${user.lastName}, </p>
                        <p>Please be informed that you have just received a request to activate your Book Shop account. Please click on the following link to activate your account! </p>
                        
                        <p> Click link to activate your account: 
                            <a href="${activateLink}">Activate your account</a> 
                        </p>
                        <p>
                            If you did not request to activate your Book Shop account, please ignore this email or reply to let us know. This password reset link is only valid for the next 30 minutes.
                        </p>

                        <p>
                            Thanks
                        </p>`
                },
            ],
        });
    return request
        .then((result) => {
            return result.body;
        })
        .catch((error) => {
            throw error;
        });
}

module.exports = { sendForgotPasswordEmail, sendActivateEmail };
