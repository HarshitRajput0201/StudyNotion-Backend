const mongoose = require('mongoose');
const mailSender = require('../utils/MailSender');

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
        expires: 5*60*1000
    }
});

async function sendVerificationEmail(email, otp){

    try {
        const mailResponse = await mailSender(
            email,
            'Email from Study Notion',
            otp
        );
        console.log('Email Sent Successfully ', mailResponse);
    } 
    catch (error) {
        console.log('Error Occur While Sending Mail',error);
    }
}

otpSchema.pre('save', async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
});

model.exports = mongoose.Schema('OTP', otpSchema);