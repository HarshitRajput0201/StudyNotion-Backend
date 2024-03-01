const { instance } = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/MailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');

exports.capturePayment = async (req, res) => {
    
    const { course_id } = req.body;
    const userId = req.user.id;
    if(!course_id){
        return res.status(401).json({
            success: false,
            message: 'Course Id Not Found'
        });
    }

    let course;
    try {
        course = await Course.findById(course_id);
        if(!course){
            return res.status(401).json({
                success: false,
                message: 'Course Not Found'
            });
        }

        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentEnrolled.includes(uid)){
            return res.status(401).json({
                success: false,
                message: 'Course Already Purchased'
            });
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Course Not Found'
        });
    }

    const amount = course.price;
    const currency = 'INR';
    const options = {
                    amount: amount*100,
                    currency,
                    receipt: Math.random(Date.now()).toString(),
                    notes: {
                        courseId: course_id,
                        userId
                    }
    };

    try {
        const paymentResponse = await instance.orders.create(options);
        return res.status(200).json({
            success: true,
            message: 'Payment Captured',
            data: paymentResponse
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Payment Failed'
        });
    }
};

exports.verifySignature = async (req, res) => {

    const webhookSecret = '123456789';
    const signature = req.header['x=razorpay-signature'];
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    if(signature === digest){
        const { courseId, userId } = req.body.payload.payment.entity.notes;
        try {
            const enrolledCourse = await Course.findByIdAndUpdate(
                                                                { _id: courseId },
                                                                { $push: { studentEnrolled: userId } },
                                                                { new: true }
            );
            if(!enrolledCourse){
                return res.status(401).json({
                    success: false,
                    message: 'Course Not Found'
                });
            }

            const enrolledStudent = await User.findOneAndUpdate(
                                                            {
                                                                _id: userId
                                                            },
                                                            {
                                                                $push: {
                                                                    courses: courseId
                                                                }
                                                            },
                                                            {
                                                                new: true
                                                            }
            );
            console.log(enrolledStudent);

            const courseDetails = await Course.findById(courseId);
            const studentDetails = await User.findById(userId);
            const emailResponse = await mailSender(
                                                enrolledStudent.email,
                                                courseEnrollmentEmail(
                                                    courseDetails.courseName,
                                                    studentDetails.firstName
                                                )
            );
            console.log(emailResponse);
            return res.status(200).json({
                success: true,
                message: 'Course Purchased Successfully'
            });

        } 
        catch (error) {
            console.log(error);
            return res.status(401).json({
                success: false,
                message: 'Course Purchase failed'
            });
        }
    }
    else{
        return res.status(401).json({
            success: false,
            message: 'Something went Wrong While Purchasing'
        });
    }
};