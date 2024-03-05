 const Course = require('../models/Course');
 const Section = require('../models/Section');
 
 
 exports.createSection = async (req, res) => {

    try {
        const { sectionName, courseId } = req.body;
        if(!sectionName || !courseId){
            return res.status(401).json({
                success: false,
                message: 'Section Name Required Along With CourseId'
            });
        }

        const newSection = await Section.create({sectionName});
        const updateCourseDetails = await Course.findByIdAndUpdate(
                                                                courseId,
                                                                {
                                                                    $push: {
                                                                        courseContent: newSection._id
                                                                    }
                                                                },
                                                                {
                                                                    new: true
                                                                }
                                                            )
                                                            .populate({
                                                                path: 'courseContent',
                                                                populate: {
                                                                    path: 'subSection'
                                                                }
                                                            })
                                                            .exec();

        return res.status(200).json({
            success: true,
            message: 'Section Created',
            updateCourseDetails
        });
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Error in Creating Section'
        });
    }
 };

 exports.updateSection = async (req, res) => {
    try {
        const{ sectionName, sectionId } = req.body;
        if(!sectionName || !sectionId){
            return res.status(401).json({
                success: false,
                message: 'Section Name or Id Not Found'
            });
        }

        const section = await Section.findByIdAndUpdate(
                                                    sectionId,
                                                    {
                                                        sectionName
                                                    },
                                                    {
                                                        new: true
                                                    }
        );
        return res.status(200).json({
            success: true,
            message: 'Section Updated'
        });

    } 
    catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: 'Section Cannot Update'
        });
    }
 };

 exports.deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.body;
        await Section.findByIdAndDelete(sectionId);
        return res.status(200).json({
            success: true,
            message: 'Section Deleted'
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Section Cannot Be Deleted'
        });
    }
 };