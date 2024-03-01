const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/ImageUploader');
require('dotenv').config();


exports.createCourse = async (req, res) => {

    try {
        const userId = req.user.id;
        const { 
            courseName, 
            courseDescription, 
            price,
            category, 
            tag,
            status,
            courseBenefits,
            instructions
        } = req.body;

        const thumbnail = req.file.thumbnailImage;
        if(!courseName || !courseDescription || !price || !tag || !category || !thumbnail || !courseBenefits){
            return res.status(401).json({
                success: false,
                message: 'All Fields Are Required'
            });
        }

        if(!status || status === undefined){
            status = 'Draft';
        }

        const instructorDetails = await User.findById(userId, { accountType: 'Instructor' });
        if(!instructorDetails){
            return res.status(401).json({
                success: false,
                message: 'Instructor Not Found'
            });
        }

        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(401).json({
                success: false,
                message: 'Category Details Not Found'
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        const newCourse = await Course.create(
                                        {
                                            courseName,
                                            courseDescription,
                                            instructor: instructorDetails._id,
                                            price,
                                            tag: tag,
                                            category: categoryDetails._id,
                                            thumbnail: thumbnail.secure_url,
                                            status: status,
                                            instructions: instructions
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

        await Category.findByIdAndUpdate(
                                    {
                                        _id: category
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

        return res.status(200).json({
            success: true,
            message: 'Course Created',
            data: newCourse
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

exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({},
                                            {
                                                courseName: true,
                                                courseDescription: true,
                                                instructor: true,
                                                price: true,
                                                ratingAndReviews: true,
                                                thumbnail: true,
                                                studentEnrolled: true,
                                            }
        )
        .populate('instructor')
        .exec();
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
            message: 'Course Not Found'
        });
    }
};

exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const courseDetails = await Course.find({ _id: courseId },)
                                                            .populate(
                                                                {
                                                                    path: 'instructor',
                                                                    populate: {
                                                                        path: 'additionalDetails'
                                                                    }
                                                                }
                                                            )
                                                            .populate('category')
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
            data: courseDetails
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