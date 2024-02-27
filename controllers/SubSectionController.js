const SubSection = require('../models/SubSection');
const Section = require('../models/SubSection');
const {uploadImageToCloudinary} = require('../utils/ImageUploader');
require('dotenv').config();

exports.createSubSection = async (req, res) => {
    try {
        const { sectionId, title, timeDuration, description } = req.body;
        const video = req.files.videoFile;
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(401).json({
                success: false,
                message: 'Something is Missing in Subsection Entry'
            });
        }

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        const subSectionDetails = await SubSection.create(
                                                    {
                                                        title: title, 
                                                        timeDuration: timeDuration, 
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
        );
        return res.status(200).json({
            success: true,
            message: 'SubSection Created'
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'SubSection Not Created'
        });
    }
}