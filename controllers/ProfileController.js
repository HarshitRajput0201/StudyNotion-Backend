const Profile = require('../models/Profile');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/ImageUploader');
require('dotenv').config();

exports.updateProfile = async (req, res) => {
    try {
        const { dateOfBirth = '', about = '', gender = '', contactNumber } = req.body;
        const id = req.user.id;

        const userDetails = await User.findById(id);
        const profileDetails = await Profile.findById(userDetails.additionalDetails);

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: 'Profile Updated',
            data: profileDetails
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Profile Cannot Be Updated'
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(401).json({
                success: false,
                message: 'No User Found'
            });
        }

        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});
        //await Course.findByIdAndDelete({_id: userDetails.})
        await User.findByIdAndDelete({_id: id});
        return res.status(200).json({
            success: true,
            message: 'Account Deleted'
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Cannot Delete Account'
        });
    }
};

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id).populate('additionaldetails').exec();
        return res.status(200).json({
            success: true,
            message: 'User Details Found',
            data: userDetails
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'User Details Not Found'
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;
        const image = await uploadImageToCloudinary(displayPicture, process.env.FOLDER_NAME, 1000, 1000);
        const userDetails = await User.findById(userId);
        const userProfile = await Profile.findById(userDetails.additionalDetails);
        
        userProfile.image = image.secure_url;
        await userProfile.save();
        return res.status(200).json({
            success: true,
            message: 'User Image Uploaded'
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'User Image Cannot Be Updated'
        });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await User.findOne({ _id: userId}).populate('courses').exec();
        if(!userDetails){
            return res.status(401).json({
                success: false,
                message: 'User Not Found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'User Found',
            data: userDetails.courses
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Something Went Wrong While Getting Courses'
        });
    }
};