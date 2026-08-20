const express = require('express');
const router = express.Router();
const { getBranches, createBranch, updateBranch } = require('../controllers/branchController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getBranches);
router.post('/', protect, authorize('Admin'), createBranch);
router.put('/:id', protect, authorize('Admin'), updateBranch);

module.exports = router;
