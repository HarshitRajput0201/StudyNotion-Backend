const express = require('express');
const router = express.Router();

const { createCategory, showAllCategories, categoryPageDetails } = require('../controllers/CategoryController');
const { createCourse, getAllCourses, getCourseDetails } = require('../controllers/CourseController');
const { createSection, updateSection, deleteSection } = require('../controllers/SectionController');
const { createSubSection, updateSubSection, deleteSubSection } = require('../controllers/SubSectionController');
const { createRating, getAverageRating, getAllRating } = require('../controllers/RatingAndReviewController');

const { auth, isStudent, isInstructor, isAdmin } = require('../middlewares/Authentication');

//Admin Routes
router.post('/createCategory', auth, isAdmin, createCategory);
router.get('/showAllCategories', showAllCategories);
router.post('/getCategoryPageDetails', categoryPageDetails);


//Instructor Routes

router.post('/createCourse', auth, isInstructor, createCourse);
router.post('/addSection', auth, isInstructor, createSection);
router.post('/updateSection', auth, isInstructor, updateSection);
router.post('/deleteSection', auth, isInstructor, deleteSection);
router.post('/addSubSection', auth, isInstructor, createSubSection);
router.post('/updateSubSection', auth, isInstructor, updateSubSection);
router.post('/deleteSubSection', auth, isInstructor, deleteSubSection);
router.post('/getCourseDetails', getCourseDetails);
router.get('/getAllCourses', getAllCourses);


//Student Routes
router.post('/createRating', auth, isStudent, createRating);
router.get('/getAverageRating', getAverageRating);
router.get('/getReviews', getAllRating);

module.exports = router;