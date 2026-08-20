const express = require('express');
const router = express.Router();
const { processPayment, getPaymentHistory, calculateRefundPreview, processRefund } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create', protect, processPayment);
router.get('/history', protect, getPaymentHistory);
router.post('/refund-preview', protect, calculateRefundPreview);
router.post('/refund', protect, processRefund);

module.exports = router;
