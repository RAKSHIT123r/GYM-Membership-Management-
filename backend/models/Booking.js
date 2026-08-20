const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'GymClass', required: true },
    status: { type: String, enum: ['Booked', 'Cancelled', 'Attended', 'No-Show'], default: 'Booked' },
    bookingDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
