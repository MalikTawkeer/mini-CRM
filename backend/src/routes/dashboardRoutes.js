const express = require('express');
const { getDashboard, getActivities } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getDashboard);
router.get('/activities', authenticate, getActivities);

module.exports = router;
