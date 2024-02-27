const Profile = require('../models/Profile');
const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
        const { dateOfBirth = '', about = '', gender = '' } = req.body;
        const id = req.user.id;
        if(!id || !dateOfBirth || !about || !gender){
            return res.status(401).json({
                success: false,
                message: 'Missing Profile Details'
            });
        }

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        await profileDetails.save();
        return res.status(200).json({
            success: true,
            message: 'Profile Updated'
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Profile Cannot Be Updated'
        });
    }
}

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
}

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id).populate('additionaldetails').exec();
        return res.status(200).json({
            success: true,
            message: 'User Details Found'
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'User Details Not Found'
        });
    }
}