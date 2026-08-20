const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true },
    paymentMethod: { type: String, enum: ['Card', 'UPI', 'Stripe', 'Razorpay', 'Cash'], default: 'Razorpay' },
    status: { type: String, enum: ['Success', 'Pending', 'Failed', 'Refunded'], default: 'Success' },
    paymentType: { type: String, enum: ['Membership Purchase', 'Membership Renewal', 'Class Booking', 'Refund', 'Locker Rental'], default: 'Membership Purchase' },
    associatedId: { type: String, default: '' }, // e.g. planId or classId
    date: { type: Date, default: Date.now },
    receiptUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
