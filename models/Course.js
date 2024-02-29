const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({

    courseName: {
        type: String
    },
    courseDescription: {
        type: String
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    thumbnail:{
        type:String,
    },
    studentEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    ratingAndReviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingAndReviews'
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section'
        }
    ],
    tag: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Published']
    }
});

module.exports = mongoose.model('Course', courseSchema);