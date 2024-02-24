const User = require("../models/User");
const OTP = require('../models/Otp');
const Profile = require('../models/Profile');
const otpGenerator = require('otp-generaotr');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sendOTP = async (req, res) => {

    try {
        const { email } = req.body;
        const checkUser = await User.findOne({ email });
        
        if(checkUser){
            return res.status(401).json({
                success: false,
                messsage: 'User Already Registered'
            });
        }

        var otp = otpGenerator.generate(6, {
                                        upperCaseAlphabet: false,
                                        lowerCaseAlphabet: false,
                                        specialChars: false
                                        });
        
        let result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6, {
                                        upperCaseAlphabet: false,
                                        lowerCaseAlphabet: false,
                                        specialChars: false
                                        });
            result = await OTP.findOne({otp:otp});
        }

        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        return res.status(200).json({
            success: true,
            messsage: 'OTP Sent'
        });
    } 

    catch (error) {
        console.log('Error in Sending OTP', error);
        return res.status(400).json({
            success: false,
            messsage: 'failed to Send OTP'
        });
    }

}

exports.signUp = async (req, res) => {

    try {
        const {
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                accountType,
                contactNumber,
                otp
        } = req.body;

        if(!firstName || !lastName || !email || !password || !contactNumber || !otp) {
            return res.status(401).json({
                success: false,
                messsage: 'All fields are required'
            });
        }

        if(password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                messsage: 'Password Do not Match'
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success: false,
                messsage: 'User Already Registered'
            });
        }

        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        if(recentOtp.length == 0){
            return res.status(401).json({
                success: false,
                messsage: 'Generate Another OTP'
            });
        }
        else if(otp !== recentOtp.otp){
            return res.status(401).json({
                success: false,
                messsage: 'Invalid OTP'
            });
        }

        const hashedPassword = bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dob: null,
            about: null,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber, 
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
        });
        return res.status(201).json({
            success: true,
            messsage: 'Profile Created',
            data: user
        });
    } 
    catch (error) {
        console.log('Error in Sign Up', error);
        return res.status(401).json({
            success: false,
            messsage: 'failed to SignUp'
        });
    }

}

exports.login = async (req, res) => {

    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                success: false,
                messsage: 'Both Fields Required'
            });
        }

        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success: false,
                messsage: 'User Does Not Exist'
            });
        }

        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2h'});
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true
            };
            res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                user,
                meassage: 'Logged In Successfully'
            });
        }
        else{
            return res.status(401).json({
                success: false,
                messsage: 'Password Is Incorrect'
            });
        }

    } 
    catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            messsage: 'LogIn Failed'
        });
    }
}