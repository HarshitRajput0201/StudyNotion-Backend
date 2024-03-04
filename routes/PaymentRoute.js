const express = require('express');
const router = express('router');

const { capturePayment, verifySignature } = require('../controllers/PaymentController');
const { auth, isStudent } = require('../middlewares/Authentication');


router.post('/capturePayment', auth, isStudent, capturePayment);
router.post('/verifySignature', verifySignature);

module.exports = router;