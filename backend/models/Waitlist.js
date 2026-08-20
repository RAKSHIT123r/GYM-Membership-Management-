const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'GymClass', required: true },
    position: { type: Number, required: true },
    joinedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Waiting', 'Promoted', 'Cancelled'], default: 'Waiting' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Waitlist', waitlistSchema);
