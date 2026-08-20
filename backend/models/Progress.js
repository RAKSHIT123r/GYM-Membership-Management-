const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    weightKg: { type: Number, required: true },
    bodyFatPercentage: { type: Number, default: 0 },
    bmi: { type: Number, default: 0 },
    chestCm: { type: Number, default: 0 },
    waistCm: { type: Number, default: 0 },
    armCm: { type: Number, default: 0 },
    legCm: { type: Number, default: 0 },
    personalRecords: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
