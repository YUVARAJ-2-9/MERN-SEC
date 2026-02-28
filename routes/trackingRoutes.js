const express = require('express');
const router = express.Router();
const {
  getTodayLogs,
  updateLogStatus,
  getWeeklyStats,
} = require('../controllers/trackingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/today', protect, getTodayLogs);
router.patch('/:id', protect, updateLogStatus);
router.get('/weekly', protect, getWeeklyStats);

module.exports = router;