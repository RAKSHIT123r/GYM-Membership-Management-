const express = require('express');
const router = express.Router();
const { getMemberQR, checkInMember, getAttendanceLogs } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/member-qr', protect, authorize('Member'), getMemberQR);
router.post('/check-in', protect, checkInMember);
router.get('/', protect, authorize('Admin', 'Trainer'), getAttendanceLogs);

module.exports = router;
