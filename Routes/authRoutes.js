const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const otps = {};



// OTP VERIFICATION USING TWILIO
router.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        const message = await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        console.log('OTP sent:', message.sid); // Log the message SID
        otps[phoneNumber] = otp;
        res.status(200).json({ message: `OTP sent to ${phoneNumber}` });
    } catch (error) {
        console.error('Error sending OTP:', error); // Log the error
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
});

router.post('/verify-otp', (req, res) => {
    const { phoneNumber, otp } = req.body;
    if (otps[phoneNumber] === otp) {
        delete otps[phoneNumber];
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid OTP or OTP expired' });
    }
});

module.exports = router;
