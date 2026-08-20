const express = require('express');
const router = express.Router();
const { getProgressHistory, addProgressRecord } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/member/:memberId', protect, getProgressHistory);
router.post('/', protect, addProgressRecord);

module.exports = router;
