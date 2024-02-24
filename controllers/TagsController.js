const Tag = require('../models/Tags');

exports.createTag = async (req, res) => {
    try {
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(401).json({
                success: false,
                messsage: 'All Field Required'
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
            messsage: 'Tag Created'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            messsage: 'Tag Cannot Be Created'
        });
    }
}

exports.showAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({}, {name: true, description: true});
        return res.status(200).json({
            success: true,
            messsage: 'Showing Tags'
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            messsage: 'Tag Cannot Be Created'
        });
    }
}