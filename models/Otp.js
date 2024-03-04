const mongoose = require('mongoose');
const mailSender = require('../utils/MailSender');
const { otpTemplate } = require('../mail/templates/emailVerificationTemplate');


const otpSchema = new mongoose.Schema({

    email:{
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
});

async function sendVerificationEmail(email, otp){

    try {
        const mailResponse = await mailSender(
            email,
            'Verification Email',
            otpTemplate(otp)
        );
        console.log('Email Sent Successfully ', mailResponse.response);
    } 
    catch (error) {
        console.log('Error Occur While Sending Mail',error);
    }
}

otpSchema.pre('save', async function(next){

    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

module.exports = mongoose.model('OTP', otpSchema);