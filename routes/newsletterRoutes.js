const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const subscribersFile = path.join(__dirname, '../data/subscribers.json');

// Helper to read subscribers
const getSubscribers = () => {
    try {
        const data = fs.readFileSync(subscribersFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to save subscribers
const saveSubscribers = (subscribers) => {
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
};

router.post('/subscribe', (req, res) => {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const subscribers = getSubscribers();

    if (subscribers.find(s => s.email === email)) {
        return res.status(409).json({ message: 'You match our vibe! But you are already subscribed.' });
    }

    const newSubscriber = {
        id: Date.now().toString(),
        email,
        subscribedAt: new Date().toISOString()
    };

    subscribers.push(newSubscriber);
    saveSubscribers(subscribers);

    res.status(201).json({ message: 'Welcome to the tribe! 🌏 check your inbox soon.' });
});

module.exports = router;
