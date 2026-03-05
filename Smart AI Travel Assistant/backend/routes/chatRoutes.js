const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/', chatController.handleChat);
router.get('/sessions', chatController.getSessions);
router.get('/history', chatController.getSessionHistory);
router.post('/transcribe', chatController.uploadMiddleware, chatController.transcribeAudio);

module.exports = router;
