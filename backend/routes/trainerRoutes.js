const express = require('express');
const router = express.Router();
const { getAllTrainers, getTrainerById, createTrainer, updateTrainer, deleteTrainer } = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllTrainers);
router.get('/:id', getTrainerById);
router.post('/', protect, authorize('Admin'), createTrainer);
router.put('/:id', protect, authorize('Admin', 'Trainer'), updateTrainer);
router.delete('/:id', protect, authorize('Admin'), deleteTrainer);

module.exports = router;
