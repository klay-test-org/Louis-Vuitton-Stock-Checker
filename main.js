const github = require('@actions/github');
const exec = require('@actions/exec');
const core = require('@actions/core');
const nodemailer = require('nodemailer');

const senderEmailService = core.getInput('sender-email-service');
const senderUsername = core.getInput('sender-username');
const senderPassword = core.getInput('sender-password');

const product = core.getInput('product');
const productLink = core.getInput('product-link');
const skuId = core.getInput('sku-id');
const receiverEmail = core.getInput('receiver-email');

const args = [`https://api.louisvuitton.com/api/eng-us/catalog/availability/${product}`, '-k', '-H', 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36', '--compressed'];
const sendEmail = () => {
    const transporter = nodemailer.createTransport({
        service: senderEmailService,
        auth: {
            user: senderUsername,
            pass: senderPassword
        }
    });

    const mailOptions = {
        from: 'Louis Vuitton Stock <' + senderUsername + '>',
        to: receiverEmail,
        subject: 'The Item You Subscribe is Available Now',
        text: productLink + '#' + skuId
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exec.exec("curl", args)
.then((_error, stdout) => {
    const json = JSON.parse(stdout).skuAvailability.find(elem => elem.skuId === skuId);
    console.log(stdout);
    if (json && json.inStock) {
        sendEmail();
    }
});

