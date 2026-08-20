const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Expiring Soon', 'Expired', 'Cancelled'], default: 'Active' },
    autoRenew: { type: Boolean, default: false },
    pricePaid: { type: Number, required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    refundedAmount: { type: Number, default: 0 },
    cancellationDate: Date,
    cancellationReason: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Membership', membershipSchema);
