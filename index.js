const express = require('express');
const app = express();

const userRoutes = require('./routes/UserRoute');
const profileRoutes = require('./routes/ProfileRoute');
const paymentRoutes = require('./routes/PaymentRoute');
const courseRoutes = require('./routes/CourseRoute');

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
        usetempFiles: true,
        tempFileDir: '/tmp'
    })
);

cloudinaryConnect();

app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/courses', courseRoutes);

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'Server Is Running'
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
