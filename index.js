const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const payatRouter = require('./routes/payatRoute');
const userRouter = require('./routes/userRoute');
const port = process.env.PORT || 5000;

const app = express();
dotenv.config();

app.use(cors())
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use('/api/users', userRouter);
app.use('/api/payat', payatRouter)



mongoose.connect(process.env.MONGODB_URI).then(() => {
    try {
        console.log('DataBase Connected');
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(port, () => {
    console.log('SERVER RUNNING ON PORT 5000');
});
