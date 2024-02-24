const Tag = require('../models/Tags');

exports.createTag = async (req, res) => {
    try {
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(401).json({
                success: false,
                message: 'All Field Required'
            });
        }

        const tagDetails = await Tag.create(
                                        {
                                            name: name,
                                            description: description
                                        }
        );
        return res.status(200).json({
            success: true,
            message: 'Tag Created',
            data: tagDetails
        });
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Tag Cannot Be Created'
        });
    }
}

exports.showAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({}, {name: true, description: true});
        return res.status(200).json({
            success: true,
            message: 'Showing Tags',
            data: allTags
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Tag Cannot Be Created'
        });
    }
}