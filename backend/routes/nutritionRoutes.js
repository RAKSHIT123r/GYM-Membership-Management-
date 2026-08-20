const express = require('express');
const router = express.Router();
const { getMemberNutritionPlan, saveNutritionPlan } = require('../controllers/nutritionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/member/:memberId', protect, getMemberNutritionPlan);
router.post('/', protect, authorize('Admin', 'Trainer'), saveNutritionPlan);

module.exports = router;
