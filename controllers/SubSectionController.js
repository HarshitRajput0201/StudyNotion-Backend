const SubSection = require('../models/SubSection');
const Section = require('../models/SubSection');
const {uploadImageToCloudinary} = require('../utils/ImageUploader');
require('dotenv').config();

exports.createSubSection = async (req, res) => {
    try {
        const { sectionId, title, description } = req.body;
        const video = req.files.videoFile;
        if(!sectionId || !title || !description || !video){
            return res.status(401).json({
                success: false,
                message: 'Something is Missing in Subsection Entry'
            });
        }

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        const subSectionDetails = await SubSection.create(
                                                    {
                                                        title: title, 
                                                        timeDuration: `${uploadDetails.duration}`, 
                                                        description: description,
                                                        videoUrl: uploadDetails.secure_url
                                                    }
        );
        const updateSection = await Section.findByIdAndUpdate(
                                                        {
                                                            _id: sectionId
                                                        },
                                                        {
                                                            $push: { SubSection: subSectionDetails._id}
                                                        },
                                                        {
                                                            new: true
                                                        }
        ).populate('subSection');
        return res.status(200).json({
            success: true,
            message: 'SubSection Created',
            updateSection
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'SubSection Not Created'
        });
    }
};

exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, title, description } = req.body;
        const subSection = await SubSection.findById(sectionId);
        if(!subSection){
            return res.status(401).json({
                success: false,
                message: 'SubSection Not Found'
            });
        }

        if(title !== undefined){
            subSection.title = title;
        }
        if(description!== undefined){
            subSection.description = description;
        }
        if(req.files && req.files.video !== undefined){
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
        }
        await subSection.save();
        return res.status(200).json({
            success: true,
            message: 'SubSection Updated'
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'SubSection Not Updated'
        });
    }
};

exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            { 
                $pull : {
                    subSectionId: subSectionId
                }
            }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId });
        if(!subSection){
            return res.status(401).json({
                success: false,
                message: 'SubSection Not Found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'SubSection Deleted'
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'SubSection Not Deleted'
        });
    }
};