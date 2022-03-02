const request = require('request');
const github = require('@actions/github');
const core = require('@actions/core');
const nodemailer = require('nodemailer');

const senderEmailService = core.getInput('sender-email-service');
const senderUsername = core.getInput('sender-username');
const senderPassword = core.getInput('sender-password');
const skuId = core.getInput('sku-id');
const receiverEmail = core.getInput('receiver-email');

const options = {
  'method': 'POST',
  'url': 'https://shop.tesla.com/inventory.json',
  'headers': {
    'content-type': 'application/json'
  },
  body: JSON.stringify([
    skuId
  ])
};

const sendEmail = () => {
    const transporter = nodemailer.createTransport({
        service: senderEmailService,
        auth: {
            user: senderUsername,
            pass: senderPassword
        }
    });

    const mailOptions = {
        from: 'Tesla Stock <' + senderUsername + '>',
        to: receiverEmail,
        subject: 'The Item You Subscribe is Available Now',
        text: 'https://shop.tesla.com/product/gen-2-nema-adapters'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

request(options, function (error, response) {
  if (error) throw new Error(error);
  if (JSON.parse(response.body)[0].purchasable === true) {
    sendMail();
  }
});
