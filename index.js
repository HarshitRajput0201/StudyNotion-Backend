const express = require('express');
const app = express();

const userRoute = require('./routes/UserRoute');
const profileRoute = require('./routes/ProfileRoute');
const paymentRoute = require('./routes/PaymentRoute');
const courseRoute = require('./routes/CourseRoute');

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { cloudinaryConnect } = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 4000;

database.connect();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: '*',
        credentials: true
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp'
    })
);

cloudinaryConnect();

app.use('/api/auth', userRoute);
app.use('/api/profile', profileRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/course', courseRoute);

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'Server Is Running'
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
