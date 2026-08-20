const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    specialization: { type: String, required: true },
    experienceYears: { type: Number, default: 3 },
    certifications: [{ type: String }],
    bio: { type: String, default: '' },
    rating: { type: Number, default: 4.9 },
    availability: { type: String, default: 'Mon-Sat: 6:00 AM - 4:00 PM' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', trainerSchema);
