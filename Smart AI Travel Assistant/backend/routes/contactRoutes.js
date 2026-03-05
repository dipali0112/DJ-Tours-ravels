const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;

    // In a real application, you would save this to a database or send an email.
    // For now, we will log it to the console to demonstrate connectivity.
    console.log('--- NEW CONTACT MESSAGE ---');
    console.log(`From: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone}`);
    console.log(`Message: ${message}`);
    console.log('---------------------------');

    res.status(200).json({ message: 'Message received successfully!' });
});

module.exports = router;
