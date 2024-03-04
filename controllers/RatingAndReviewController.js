const RatingAndReviews = require('../models/RatingAndReviews');
const Course = require('../models/Course');

exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;
        const courseDetails = await Course.findOne(
                                                {
                                                    _id: courseId,
                                                    studentEnrolled: {
                                                        $elemMatch: {
                                                            $eq: userId
                                                        }
                                                    } 
                                                }
        );
        if(!courseDetails){
            return res.status(401).json({
                success: false,
                message: 'Course Details Not Found'
            });
        }

        const alreadyReviewed = await RatingAndReviews.findOne(
                                                        {
                                                            user: userId,
                                                            course: courseId
                                                        }
        );
        if(alreadyReviewed){
            return res.status(401).json({
                success: false,
                message: 'Review Found!! Cannot Post Another Review'
            });
        }

        const ratingReview = await RatingAndReviews.create(
                                                        {
                                                            rating, 
                                                            review,
                                                            course: courseId,
                                                            user: userId
                                                        }
        );
        const updatedCourseDetails = await Course.findIdAndUpdate(
                                { 
                                    _id: courseId 
                                },
                                {
                                    $push: {
                                        RatingAndReviews: ratingReview._id
                                    }
                                },
                                {
                                    new: true
                                }
        );
        return res.status(200).json({
            success: true,
            message: 'Review Created',
            updatedCourseDetails
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Review Not Created'
        });
    }
};

exports.getAverageRating = async (req, res) => {
    try {
        const courseId = req.body.courseId;
        const result = await RatingAndReviews.aggregate([
                                                    {
                                                        $match: {
                                                            course: new mongoose.Types.ObjectId(courseId)
                                                        }
                                                    },
                                                    {
                                                        $group: {
                                                            _id: null,
                                                            averageRating: {
                                                                $avg: '$rating'
                                                            }
                                                        }
                                                    }
        ]);
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                message: 'Average Rating Created',
                averageRating: result[0].averageRating
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Average Rating Created',
            averageRating: 0
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Cannot Get Rating'
        });
    }
};

exports.getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReviews.find({})
                                                    .sort({ rating: 'desc'})
                                                    .populate(
                                                        {
                                                            path: 'user',
                                                            select: 'firstName lastName email image'
                                                        }
                                                    )
                                                    .populate(
                                                        {
                                                            path: 'course',
                                                            select: 'courseName'
                                                        }
                                                    )
                                                    .exec();
        return res.status(200).json({
            success: true,
            message: 'Got All Reviews',
            data: allReviews
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Cannot Get Reviews'
        });
    }
};