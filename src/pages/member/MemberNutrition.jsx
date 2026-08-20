import React, { useState, useEffect } from 'react';
import { getMemberNutritionApi } from '../../services/api';
import { Apple, Flame, Droplets, CheckCircle2, AlertOctagon } from 'lucide-react';

const MemberNutrition = () => {
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNutrition();
  }, []);

  const loadNutrition = async () => {
    try {
      const { data } = await getMemberNutritionApi('my');
      setNutrition(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading nutrition plan...</div>;
  }

  if (!nutrition) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto my-12">
        <Apple className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Nutrition Plan Assigned</h3>
        <p className="text-xs text-slate-400">Your trainer will assign your custom calorie and macro targets shortly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="glass-card p-6 rounded-3xl border border-dark-border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan uppercase">
              Daily Macro Target
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">{nutrition.title}</h1>
          </div>

          <div className="flex items-center gap-4 bg-dark-surface px-6 py-3 rounded-2xl border border-dark-border text-center">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Daily Calories</div>
              <div className="text-2xl font-extrabold text-brand-400">{nutrition.dailyCalories} kcal</div>
            </div>
            <div className="w-px h-8 bg-dark-border" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Hydration Goal</div>
              <div className="text-2xl font-extrabold text-neon-cyan">{nutrition.waterTargetLiters} L</div>
            </div>
          </div>
        </div>

        {/* Macro Bars */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border text-center">
            <div className="text-xs text-slate-400 mb-1">Protein Target</div>
            <div className="text-xl font-extrabold text-brand-400">{nutrition.proteinGrams}g</div>
          </div>

          <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border text-center">
            <div className="text-xs text-slate-400 mb-1">Carbohydrates</div>
            <div className="text-xl font-extrabold text-neon-cyan">{nutrition.carbsGrams}g</div>
          </div>

          <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border text-center">
            <div className="text-xs text-slate-400 mb-1">Healthy Fats</div>
            <div className="text-xl font-extrabold text-neon-amber">{nutrition.fatsGrams}g</div>
          </div>
        </div>
      </div>

      {/* Meals Breakdown */}
      <div className="glass-panel p-6 rounded-3xl border border-dark-border space-y-4">
        <h3 className="text-base font-bold text-white">Daily Meal Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nutrition.meals?.map((m, idx) => (
            <div key={idx} className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">{m.mealType}</span>
                <span className="text-xs text-brand-400 font-mono">{m.time} ({m.calories} kcal)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{m.foodItems}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberNutrition;
