const User = require("../models/User");
const mailSender = require("../utils/MailSender");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.resetPasswordToken = async (req, res) => {

    try {
        const {email} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'User Not Found'
            });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const updatedDetails = await User.findOneAndUpdate({
                                                            email: email
                                                        },
                                                        {
                                                            token: token,
                                                            resetPasswordExpire: Date.now() + 5*60*1000
                                                        },
                                                        {
                                                            new: true
                                                        }
        );
        const url = `https://localhost:3000/update-password/${token}`;
        await mailSender(email, 'Password Reset Link', `link: ${url}`);
        return res.status(201).json({
            success: true,
            message: 'Link Sent Successfully'
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Somethinng Went Wrong While Resetting Password',
            error: error.message
        });
    }
};

exports.resetPassword = async (req,res) => {
    try {
        const { password, confirmPassword, token } = req.body;
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: 'Password Does Not Match'
            });
        }

        const userDetails = await User.findOne({ token: token });
        if(!userDetails){
            return res.status(401).json({
                success: false,
                message: 'Invalid Token'
            });
        }
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(401).json({
                success: false,
                message: 'Token Expired'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
                                {
                                    token: token
                                },
                                {
                                    password: hashedPassword
                                },
                                {
                                    new: true
                                }
        );
        return res.status(201).json({
            success: true,
            message: 'Password Updated Successfully'
        });

    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Somethinng Went Wrong While Resetting Password'
        });
    }
};

