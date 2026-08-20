const express = require('express');
const router = express.Router();
const { getAllMembers, getMemberById, updateMember, deleteMember } = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Admin', 'Trainer'), getAllMembers);
router.get('/:id', protect, getMemberById);
router.put('/:id', protect, updateMember);
router.delete('/:id', protect, authorize('Admin'), deleteMember);

module.exports = router;
