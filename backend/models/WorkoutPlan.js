const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    goal: { type: String, default: 'Hypertrophy & Strength' },
    durationWeeks: { type: Number, default: 4 },
    weeklySchedule: [{ type: String }], // e.g. ["Monday", "Wednesday", "Friday"]
    exercises: [
      {
        day: { type: String, default: 'Day 1' },
        name: { type: String, required: true },
        sets: { type: Number, default: 3 },
        reps: { type: String, default: '10-12' },
        weightKg: { type: Number, default: 0 },
        restSeconds: { type: Number, default: 60 },
        notes: { type: String, default: '' }
      }
    ],
    instructions: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
