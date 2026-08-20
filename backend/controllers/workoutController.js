const WorkoutPlan = require('../models/WorkoutPlan');
const Member = require('../models/Member');

// @desc    Get assigned workout plan for a member
// @route   GET /api/workouts/member/:memberId
exports.getMemberWorkoutPlan = async (req, res) => {
  try {
    let memberId = req.params.memberId;
    if (memberId === 'my') {
      const member = await Member.findOne({ userId: req.user._id });
      if (!member) return res.status(404).json({ message: 'Member profile not found' });
      memberId = member._id;
    }

    const plan = await WorkoutPlan.findOne({ memberId, isActive: true })
      .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name email profileImage' } })
      .sort({ updatedAt: -1 });

    res.json(plan || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update workout plan (Trainer / Admin)
// @route   POST /api/workouts
exports.saveWorkoutPlan = async (req, res) => {
  try {
    const { memberId, title, goal, durationWeeks, weeklySchedule, exercises, instructions } = req.body;

    let trainerId = req.body.trainerId;
    if (!trainerId && req.user.role === 'Trainer') {
      const Trainer = require('../models/Trainer');
      const tr = await Trainer.findOne({ userId: req.user._id });
      if (tr) trainerId = tr._id;
    }

    if (!trainerId) {
      const Trainer = require('../models/Trainer');
      const tr = await Trainer.findOne();
      if (tr) trainerId = tr._id;
    }

    // Deactivate previous active plans for this member
    await WorkoutPlan.updateMany({ memberId }, { isActive: false });

    const newPlan = await WorkoutPlan.create({
      title: title || 'Custom Hypertrophy Routine',
      memberId,
      trainerId,
      goal: goal || 'Muscle Building',
      durationWeeks: durationWeeks || 4,
      weeklySchedule: weeklySchedule || ['Monday', 'Wednesday', 'Friday'],
      exercises: exercises || [],
      instructions: instructions || 'Stay hydrated and maintain proper form on all compound lifts.',
      isActive: true
    });

    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
