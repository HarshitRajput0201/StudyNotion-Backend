const express = require('express');
const router = express.Router();

const { signUp, login, sendOTP, changePassword } = require('../controllers/AuthController');
const { resetPasswordToken, resetPassword } = require('../controllers/ResetPasswordController');
const { auth } = require('../middlewares/Authentication');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/sendotp', sendOTP);
router.post('/changepassword', auth, changePassword);

router.post('/reset-password-token', resetPasswordToken);
router.post('/reset-password', resetPassword);

module.exports = router;