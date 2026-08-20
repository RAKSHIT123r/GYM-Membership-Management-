const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema(
  {
    lockerNumber: { type: String, required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    status: { type: String, enum: ['Available', 'Assigned', 'Maintenance'], default: 'Available' },
    assignedToMemberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
    assignedDate: Date,
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Locker', lockerSchema);
