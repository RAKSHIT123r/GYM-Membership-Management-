const { WorkoutPlan, Member, Trainer, User } = require('../models');

// @desc    Get assigned workout plan for a member
// @route   GET /api/workouts/member/:memberId
exports.getMemberWorkoutPlan = async (req, res) => {
  try {
    let memberId = req.params.memberId;
    if (memberId === 'my') {
      const member = await Member.findOne({ where: { userId: req.user.id } });
      if (!member) return res.status(404).json({ message: 'Member profile not found' });
      memberId = member.id;
    }

    const plan = await WorkoutPlan.findOne({
      where: { memberId, isActive: true },
      include: [
        { model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name', 'email', 'profileImage'] }] }
      ],
      order: [['updatedAt', 'DESC']]
    });

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
      const tr = await Trainer.findOne({ where: { userId: req.user.id } });
      if (tr) trainerId = tr.id;
    }

    if (!trainerId) {
      const tr = await Trainer.findOne();
      if (tr) trainerId = tr.id;
    }

    // Deactivate previous active plans for this member
    await WorkoutPlan.update({ isActive: false }, { where: { memberId } });

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
