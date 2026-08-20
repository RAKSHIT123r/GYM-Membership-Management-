const mongoose = require('mongoose');

const gymClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ['Yoga', 'Zumba', 'CrossFit', 'Strength Training', 'Cardio', 'HIIT', 'Boxing', 'Spinning'], required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // e.g. "08:00 AM"
    endTime: { type: String, required: true }, // e.g. "09:00 AM"
    durationMinutes: { type: Number, default: 60 },
    capacity: { type: Number, required: true, default: 20 },
    bookedSeats: { type: Number, default: 0 },
    description: { type: String, default: '' },
    locationRoom: { type: String, default: 'Studio 1' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GymClass', gymClassSchema);
