const { NutritionPlan, Member, Trainer, User } = require('../models');

// @desc    Get nutrition plan for a member
// @route   GET /api/nutrition/member/:memberId
exports.getMemberNutritionPlan = async (req, res) => {
  try {
    let memberId = req.params.memberId;
    if (memberId === 'my') {
      const member = await Member.findOne({ where: { userId: req.user.id } });
      if (!member) return res.status(404).json({ message: 'Member profile not found' });
      memberId = member.id;
    }

    const plan = await NutritionPlan.findOne({
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

// @desc    Save/Update nutrition plan (Trainer/Admin)
// @route   POST /api/nutrition
exports.saveNutritionPlan = async (req, res) => {
  try {
    const { memberId, title, dailyCalories, proteinGrams, carbsGrams, fatsGrams, waterTargetLiters, meals, recommendedFoods, foodsToAvoid } = req.body;

    let trainerId = req.body.trainerId;
    if (!trainerId && req.user.role === 'Trainer') {
      const tr = await Trainer.findOne({ where: { userId: req.user.id } });
      if (tr) trainerId = tr.id;
    }

    if (!trainerId) {
      const tr = await Trainer.findOne();
      if (tr) trainerId = tr.id;
    }

    await NutritionPlan.update({ isActive: false }, { where: { memberId } });

    const newPlan = await NutritionPlan.create({
      title: title || 'Lean Bulking Nutrition Blueprint',
      memberId,
      trainerId,
      dailyCalories: dailyCalories || 2500,
      proteinGrams: proteinGrams || 170,
      carbsGrams: carbsGrams || 260,
      fatsGrams: fatsGrams || 75,
      waterTargetLiters: waterTargetLiters || 3.5,
      meals: meals || [],
      recommendedFoods: recommendedFoods || ['Chicken Breast', 'Eggs', 'Oats', 'Salmon', 'Greek Yogurt'],
      foodsToAvoid: foodsToAvoid || ['Refined Sugar', 'Processed Fast Foods', 'Trans Fats'],
      isActive: true
    });

    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
