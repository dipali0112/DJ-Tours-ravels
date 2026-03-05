const express = require('express');
const router = express.Router();
const travelPlanController = require('../controllers/travelPlanController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, travelPlanController.getTravelPlan);

module.exports = router;
