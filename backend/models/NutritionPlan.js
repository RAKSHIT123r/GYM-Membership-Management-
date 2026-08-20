const mongoose = require('mongoose');

const nutritionPlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    dailyCalories: { type: Number, required: true, default: 2400 },
    proteinGrams: { type: Number, default: 160 },
    carbsGrams: { type: Number, default: 250 },
    fatsGrams: { type: Number, default: 70 },
    waterTargetLiters: { type: Number, default: 3.5 },
    meals: [
      {
        mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Pre-Workout', 'Post-Workout'] },
        time: { type: String, default: '08:00 AM' },
        foodItems: { type: String, required: true },
        calories: { type: Number, default: 400 }
      }
    ],
    recommendedFoods: [{ type: String }],
    foodsToAvoid: [{ type: String }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('NutritionPlan', nutritionPlanSchema);
