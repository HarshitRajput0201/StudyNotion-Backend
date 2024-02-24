const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({

    courseName: {
        type: String
    },
    courseDescription: {
        type: String,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: String
    },
    tag:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    },
    thumbnail:{
        type:String,
    },
    studentEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseContent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReviews"
    }
});

module.exports = mongoose.Schema('Course', courseSchema);