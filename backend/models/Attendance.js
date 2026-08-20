const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: Date,
    date: { type: String, required: true }, // YYYY-MM-DD
    status: { type: String, enum: ['Granted', 'Denied'], default: 'Granted' },
    denialReason: { type: String, default: '' },
    verifiedBy: { type: String, default: 'QR Automated Kiosk' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
