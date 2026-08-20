const express = require('express');
const router = express.Router();
const { getLockers, assignLocker, releaseLocker, createLocker } = require('../controllers/lockerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getLockers);
router.post('/', protect, authorize('Admin'), createLocker);
router.post('/:id/assign', protect, authorize('Admin'), assignLocker);
router.post('/:id/release', protect, authorize('Admin'), releaseLocker);

module.exports = router;
