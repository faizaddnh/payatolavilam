const express = require('express');
const user = require('../model/userModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { generateToken } = require("../utils.js");
const { Module } = require('module');
const { MongoDriverError } = require('mongodb');


const userRouter = express.Router();
dotenv.config();


userRouter.get('/', function (req, res) {
    user.find({}, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });

});

userRouter.post(
    "/signin",
    async (req, res) => {
        const User = await user.findOne({ email: req.body.email });
        if (User) {
            res.send({
                _id: User._id,
                name: User.name,
                email: User.email,
                mobile: User.mobile,
                serialNum: User.serialNum,
                isAdmin: User.isAdmin,
                token: generateToken(User),
            });
            return;
        }
        res.status(401).send({ message: "Invalid email or password" });
    }
);


userRouter.post('/signup', (req, res) => {
    var mod = new user(req.body);
    mod.save(function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send({
                _id: mod._id,
                name: mod.name,
                email: mod.email,
                mobile: mod.mobile,
                serialNum: mod.serialNum,
                isAdmin: mod.isAdmin,
                token: generateToken(mod),
            });
        }
    });

});





















userRouter.put('/:id', async (req, res) => {
    try {
        const updateUser = await user.findByIdAndUpdate(req.params.id, req.body);
        res.json(updateUser);
        console.log('USER updated')
    }
    catch (err) {
        rs.json(err);
    }
});

userRouter.delete('/:id', async (req, res) => {
    try {
        const deleteUser = await user.findByIdAndDelete(req.params.id);
        res.status(200).json('Item Deleted');

    }
    catch (err) {
        res.json(err);
    }
});











userRouter.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Generate a unique token
    const token = crypto.randomBytes(20).toString('hex');

    try {
        // Find user by email
        const User = await user.findOne({ email });

        if (!User) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Save the token and its expiration time to the user in the database
        User.resetPasswordToken = token;
        User.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await User.save();

        // Send the reset link to the user's email
        const transporter = nodemailer.createTransport({
            // Set up your email transporter (e.g., SMTP, SendGrid, etc.)
            service: 'gmail',
            auth: {
                user: 'faizaddnh@gmail.com',
                pass: 'fkdx ifuy iykg pvbh',
            },

        });

        const mailOptions = {
            from: 'faizaddnh@gamil.com',
            to: User.email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${process.env.YOUR_FRONTEND_RESET_URL}/${token}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Step 4: Handle password reset
userRouter.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Find user by token
        const User = await user.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!User) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Update the password
        User.password = newPassword;
        User.resetPasswordToken = undefined;
        User.resetPasswordExpires = undefined;

        await User.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





module.exports = userRouter;