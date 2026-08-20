const express = require('express');
const router = express.Router();
const { getAllClasses, createClass, bookClass, cancelBooking, deleteClass } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllClasses);
router.post('/', protect, authorize('Admin', 'Trainer'), createClass);
router.post('/:id/book', protect, authorize('Member'), bookClass);
router.post('/:id/cancel', protect, cancelBooking);
router.delete('/:id', protect, authorize('Admin'), deleteClass);

module.exports = router;
