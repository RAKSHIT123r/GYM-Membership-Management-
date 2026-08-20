import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMemberWorkoutApi, getMemberNutritionApi, getClassesApi } from '../../services/api';
import QRModal from '../../components/member/QRModal';
import { Dumbbell, Apple, Calendar, QrCode, ShieldCheck, AlertTriangle, ArrowRight, Sparkles, RefreshCw, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
  const { user, justRegistered, clearJustRegistered } = useAuth();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const member = user?.roleDetails;

  useEffect(() => {
    if (member?._id) {
      loadData();
    } else {
      setLoading(false);
    }
    if (justRegistered) {
      clearJustRegistered();
    }
  }, [member]);

  const loadData = async () => {
    try {
      const [wRes, nRes] = await Promise.all([
        getMemberWorkoutApi(member._id),
        getMemberNutritionApi(member._id)
      ]);
      setWorkoutPlan(wRes.data);
      setNutritionPlan(nRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-brand-500" />
        <span>Loading your fitness portal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Active Membership Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-dark-border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Member Portal Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{justRegistered ? `Welcome, ${user?.name}!` : `Welcome back, ${user?.name}!`}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
            <span className="font-bold text-white">Plan: {member?.membershipPlanId?.name || 'No Plan Active'}</span>
            <span>•</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                member?.membershipStatus === 'Active'
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                  : 'bg-neon-rose/15 text-neon-rose border border-neon-rose/30'
              }`}
            >
              {member?.membershipStatus === 'Active' ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {member?.membershipStatus || 'Inactive'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => setShowQRModal(true)}
            className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-xl shadow-brand-500/25 flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Digital QR Pass</span>
          </button>

          <Link
            to="/member/plans"
            className="px-5 py-3 rounded-2xl glass-panel hover:border-slate-500 text-white font-bold text-xs transition-all"
          >
            Renew / Upgrade Plan
          </Link>
        </div>
      </div>

      {/* Fitness Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workout Plan Preview */}
        <div className="glass-card rounded-3xl p-6 border border-dark-border space-y-4 hover:border-brand-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Assigned Workout Plan</h3>
                <p className="text-xs text-slate-400">{workoutPlan ? workoutPlan.title : 'No active workout plan assigned'}</p>
              </div>
            </div>
            <Link to="/member/workout" className="text-xs text-brand-400 hover:underline font-bold flex items-center gap-1">
              View Routine <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {workoutPlan ? (
            <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Goal:</span>
                <strong className="text-white">{workoutPlan.goal}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Exercises Configured:</span>
                <strong className="text-brand-400">{workoutPlan.exercises?.length || 0} Exercises</strong>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-dark-border rounded-2xl">
              Your coach has not assigned a custom workout plan yet.
            </div>
          )}
        </div>

        {/* Nutrition Plan Preview */}
        <div className="glass-card rounded-3xl p-6 border border-dark-border space-y-4 hover:border-brand-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                <Apple className="w-5 h-5 text-neon-cyan" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Nutrition & Macro Blueprint</h3>
                <p className="text-xs text-slate-400">{nutritionPlan ? `${nutritionPlan.dailyCalories} kcal / day` : 'No plan active'}</p>
              </div>
            </div>
            <Link to="/member/nutrition" className="text-xs text-neon-cyan hover:underline font-bold flex items-center gap-1">
              View Meals <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {nutritionPlan ? (
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-dark-surface p-2.5 rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Protein</div>
                <div className="font-extrabold text-brand-400 text-sm">{nutritionPlan.proteinGrams}g</div>
              </div>
              <div className="bg-dark-surface p-2.5 rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Carbs</div>
                <div className="font-extrabold text-neon-cyan text-sm">{nutritionPlan.carbsGrams}g</div>
              </div>
              <div className="bg-dark-surface p-2.5 rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Fats</div>
                <div className="font-extrabold text-neon-amber text-sm">{nutritionPlan.fatsGrams}g</div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-dark-border rounded-2xl">
              Nutrition plan details pending coach assignment.
            </div>
          )}
        </div>
      </div>

      {showQRModal && <QRModal onClose={() => setShowQRModal(false)} />}
    </div>
  );
};

export default MemberDashboard;
