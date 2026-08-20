const NutritionPlan = require('../models/NutritionPlan');
const Member = require('../models/Member');

// @desc    Get nutrition plan for a member
// @route   GET /api/nutrition/member/:memberId
exports.getMemberNutritionPlan = async (req, res) => {
  try {
    let memberId = req.params.memberId;
    if (memberId === 'my') {
      const member = await Member.findOne({ userId: req.user._id });
      if (!member) return res.status(404).json({ message: 'Member profile not found' });
      memberId = member._id;
    }

    const plan = await NutritionPlan.findOne({ memberId, isActive: true })
      .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name email profileImage' } })
      .sort({ updatedAt: -1 });

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
      const Trainer = require('../models/Trainer');
      const tr = await Trainer.findOne({ userId: req.user._id });
      if (tr) trainerId = tr._id;
    }

    if (!trainerId) {
      const Trainer = require('../models/Trainer');
      const tr = await Trainer.findOne();
      if (tr) trainerId = tr._id;
    }

    await NutritionPlan.updateMany({ memberId }, { isActive: false });

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
