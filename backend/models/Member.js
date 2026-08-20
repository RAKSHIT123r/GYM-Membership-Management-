const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    membershipPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan' },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    membershipStatus: { type: String, enum: ['Active', 'Expiring Soon', 'Expired', 'Cancelled', 'None'], default: 'None' },
    startDate: Date,
    endDate: Date,
    autoRenew: { type: Boolean, default: false },
    qrCodeToken: { type: String, unique: true, sparse: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Unspecified'], default: 'Unspecified' },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relation: { type: String, default: '' }
    },
    fitnessGoal: { type: String, default: 'General Fitness & Muscle Gain' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
