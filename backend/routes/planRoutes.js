const express = require('express');
const router = express.Router();
const { getAllPlans, createPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllPlans);
router.post('/', protect, authorize('Admin'), createPlan);
router.put('/:id', protect, authorize('Admin'), updatePlan);
router.delete('/:id', protect, authorize('Admin'), deletePlan);

module.exports = router;
