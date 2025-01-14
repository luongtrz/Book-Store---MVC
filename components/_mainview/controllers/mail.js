'use strict';

const Mailjet = require('node-mailjet');

function sendForgotPasswordEmail(user, host, resetLink) {
    const mailjet = Mailjet.apiConnect(
        process.env.MJ_APIKEY_PUBLIC, // Ensure these environment variables are correctly set
        process.env.MJ_APIKEY_PRIVATE
    );
    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: "vungoca396@gmail.com",
                        Name: "BookShop",
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
        process.env.MJ_APIKEY_PUBLIC, // Ensure these environment variables are correctly set
        process.env.MJ_APIKEY_PRIVATE
    );
    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: "vungoca396@gmail.com",
                        Name: "BookShop",
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