const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if(!name || !description){
            return res.status(401).json({
                success: false,
                message: 'All Field Required'
            });
        }

        const categoryDetails = await Category.create(
                                        {
                                            name: name,
                                            description: description
                                        }
        );
        return res.status(200).json({
            success: true,
            message: 'Category Created',
            data: categoryDetails
        });
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Category Cannot Be Created'
        });
    }
};

exports.showAllCategories = async (req, res) => {
    try {
        const allCategory = await Category.find({}, { name: true, description: true });
        return res.status(200).json({
            success: true,
            message: 'Showing Category',
            data: allCategory
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Category Cannot Be Created'
        });
    }
};

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const selectedCategory = await Category.findById(categoryId).populate('courses').exec();
        if(!selectedCategory){
            return res.status(401).json({
                success: false,
                message: 'Category Not Found'
            });
        }

        const differentCategory = await Category.find({ _id: { $ne: categoryId } }).populate('courses').exec();
        return res.status(200).json({
            success: true,
            message: 'Showing Category Details',
            data: {
                differentCategory,
                selectedCategory
            }
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Cannot Get Category Page Details',
            error: error.message
        });
    }
};