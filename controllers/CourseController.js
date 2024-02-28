const Course = require('../models/Course');
const Tag = require('../models/Tags');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/ImageUploader');
require('dotenv').config();


exports.createCourse = async (req, res) => {

    try {
        const { courseName, courseDescription, price, tag } = req.body;
        const thumbnail = req.file.thumbnailImage;
        if(!courseName || !courseDescription || !price || !tag){
            return res.status(401).json({
                success: false,
                message: 'All Fields Are Required'
            });
        }

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        if(!instructorDetails){
            return res.status(401).json({
                success: false,
                message: 'Instructor Not Found'
            });
        }

        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(401).json({
                success: false,
                message: 'Tag Not Found'
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        const newCourse = await Course.create(
                                        {
                                            courseName,
                                            courseDescription,
                                            instructor: instructorDetails._id,
                                            price,
                                            tag: tagDetails._id,
                                            thumbnail: thumbnail.secure_url
                                        }
        );

        await User.findByIdAndUpdate(
                                {
                                    _id: instructorDetails._id
                                },
                                {
                                    $push: {
                                        courses: newCourse._id
                                    }
                                },
                                {
                                    new: true
                                }
        );

        //update Tags HW

        return res.status(200).json({
            success: true,
            message: 'Course Created'
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Course Not Created'
        });
    }
};

exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({},
                                            {
                                                courseName: true,
                                                courseDescription: true,
                                                instructor: true,
                                                price: true,
                                                tag: true,
                                                thumbnail: true,
                                                studentEnrolled: true,
                                            }
        ).populate('instructor').exec();
        return res.status(200).json({
            success: true,
            message: 'All Courses Available',
            data: allCourses
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Course Not Created'
        });
    }
};

exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const courseDetails = await Course.find(
                                            { _id: courseId },
        )
        .populate(
            {
                path: 'Instructor',
                populate: {
                    path: 'additionalDetails'
                }
            }
        )
        .populate('Category')
        .populate('ratingAndReviews')
        .populate(
            {
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            }
        )
        .exec();
        if(!courseDetails){
            return res.status(401).json({
                success: false,
                message: 'Course Details Not Found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Course Details Found',
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Course Not Found'
        });
    }
};