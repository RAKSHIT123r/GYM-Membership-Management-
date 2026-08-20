import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTrainerByIdApi, saveNutritionApi } from '../../services/api';
import { Apple, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const NutritionBuilder = () => {
  const { user } = useAuth();
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [title, setTitle] = useState('Lean Bulking & Performance Macro Blueprint');
  const [dailyCalories, setDailyCalories] = useState(2600);
  const [proteinGrams, setProteinGrams] = useState(175);
  const [carbsGrams, setCarbsGrams] = useState(280);
  const [fatsGrams, setFatsGrams] = useState(70);
  const [waterTargetLiters, setWaterTargetLiters] = useState(3.5);
  const [meals, setMeals] = useState([
    { mealType: 'Breakfast', time: '08:00 AM', foodItems: '4 Whole Eggs, 80g Oatmeal, 1 Banana', calories: 650 },
    { mealType: 'Lunch', time: '01:00 PM', foodItems: '200g Grilled Chicken, 150g Rice, Steamed Broccoli', calories: 750 },
    { mealType: 'Dinner', time: '08:00 PM', foodItems: '200g Atlantic Salmon, Sweet Potato, Salad', calories: 700 }
  ]);
  const [recommendedFoods, setRecommendedFoods] = useState('Chicken Breast, Eggs, Salmon, Oats, Greek Yogurt');
  const [foodsToAvoid, setFoodsToAvoid] = useState('Deep Fried Foods, Sugary Sodas, Processed Fast Foods');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user?.roleDetails?._id) {
      loadTrainerData();
    }
  }, [user]);

  const loadTrainerData = async () => {
    try {
      const { data } = await getTrainerByIdApi(user.roleDetails._id);
      setAssignedMembers(data.assignedMembers || []);
      if (data.assignedMembers && data.assignedMembers.length > 0) {
        setSelectedMemberId(data.assignedMembers[0]._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMeal = () => {
    setMeals([...meals, { mealType: 'Snacks', time: '04:30 PM', foodItems: '1 Scoop Whey Protein & Almonds', calories: 300 }]);
  };

  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  const handleSaveNutrition = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    try {
      const recArr = recommendedFoods.split(',').map((s) => s.trim());
      const avoidArr = foodsToAvoid.split(',').map((s) => s.trim());

      await saveNutritionApi({
        memberId: selectedMemberId,
        title,
        dailyCalories,
        proteinGrams,
        carbsGrams,
        fatsGrams,
        waterTargetLiters,
        meals,
        recommendedFoods: recArr,
        foodsToAvoid: avoidArr
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Apple className="w-6 h-6 text-brand-400" /> Macro Nutrition Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure daily calorie targets, protein/carb/fat macros & meal schedules</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> Nutrition Assigned!
          </div>
        )}
      </div>

      <form onSubmit={handleSaveNutrition} className="space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-dark-border grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Select Client</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white bg-dark-surface"
              required
            >
              {assignedMembers.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.userId?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Calories (kcal)</label>
            <input
              type="number"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(Number(e.target.value))}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Protein (g)</label>
            <input
              type="number"
              value={proteinGrams}
              onChange={(e) => setProteinGrams(Number(e.target.value))}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Carbs (g)</label>
            <input
              type="number"
              value={carbsGrams}
              onChange={(e) => setCarbsGrams(Number(e.target.value))}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Fats (g)</label>
            <input
              type="number"
              value={fatsGrams}
              onChange={(e) => setFatsGrams(Number(e.target.value))}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white"
              required
            />
          </div>
        </div>

        {/* Meal Schedule */}
        <div className="glass-panel p-6 rounded-3xl border border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Daily Meal Schedule</h3>
            <button
              type="button"
              onClick={handleAddMeal}
              className="px-4 py-2 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 text-brand-400 font-bold text-xs border border-brand-500/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Meal
            </button>
          </div>

          <div className="space-y-3">
            {meals.map((m, idx) => (
              <div key={idx} className="bg-dark-surface p-4 rounded-2xl border border-dark-border grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-xs">
                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Meal Type</label>
                  <input
                    type="text"
                    value={m.mealType}
                    onChange={(e) => handleMealChange(idx, 'mealType', e.target.value)}
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-white font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Food Items</label>
                  <input
                    type="text"
                    value={m.foodItems}
                    onChange={(e) => handleMealChange(idx, 'foodItems', e.target.value)}
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Time</label>
                  <input
                    type="text"
                    value={m.time}
                    onChange={(e) => handleMealChange(idx, 'time', e.target.value)}
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Est. Calories</label>
                  <input
                    type="number"
                    value={m.calories}
                    onChange={(e) => handleMealChange(idx, 'calories', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-white text-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-sm transition-all shadow-xl shadow-brand-500/25"
        >
          Assign Nutrition Plan to Member
        </button>
      </form>
    </div>
  );
};

export default NutritionBuilder;
