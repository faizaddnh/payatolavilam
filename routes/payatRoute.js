const express = require('express');
const payat = require('../model/payatModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { isAuth } = require('../utils');

const payatRouter = express.Router();
dotenv.config();


payatRouter.get('/', (req, res) => {
    payat.find({}, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    }).populate("depositedPayatee").populate("receivedPayatee");

});

payatRouter.post('/', isAuth, async (req, res) => {
    try {
        var mod = new payat({
            payatAmount: req.body.payatAmount,
            depositedPayatee: req.body.depositedPayatee,
            receivedPayatee: req.user._id,
        });

        const payatukal = await mod.save();
        res.send({ data: 'PAYAT ADDED' });


    } catch (err) {
        res.send(err)

    }
});

module.exports = payatRouter;