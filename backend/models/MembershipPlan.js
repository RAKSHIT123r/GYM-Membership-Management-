const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    durationDays: { type: Number, required: true }, // 30, 90, 180, 365
    price: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    accessLevel: { type: String, enum: ['Basic', 'Standard', 'VIP Premium', 'All Access'], default: 'Standard' },
    classAccess: { type: Boolean, default: true },
    branchAccess: { type: String, enum: ['Single Branch', 'Multi-Branch Access'], default: 'Single Branch' },
    autoRenewEligible: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
