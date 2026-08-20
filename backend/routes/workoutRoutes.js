const express = require('express');
const router = express.Router();
const { getMemberWorkoutPlan, saveWorkoutPlan } = require('../controllers/workoutController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/member/:memberId', protect, getMemberWorkoutPlan);
router.post('/', protect, authorize('Admin', 'Trainer'), saveWorkoutPlan);

module.exports = router;
