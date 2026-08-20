import React, { useState, useEffect } from 'react';
import { getMemberWorkoutApi } from '../../services/api';
import { Dumbbell, Clock, Flame, ShieldAlert, CheckCircle } from 'lucide-react';

const MemberWorkout = () => {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkout();
  }, []);

  const loadWorkout = async () => {
    try {
      const { data } = await getMemberWorkoutApi('my');
      setWorkout(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading workout routine...</div>;
  }

  if (!workout) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto my-12">
        <Dumbbell className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Assigned Workout Plan</h3>
        <p className="text-xs text-slate-400">Your personal coach has not created a custom routine for you yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="glass-card p-6 rounded-3xl border border-dark-border space-y-2">
        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 uppercase">
          {workout.goal} ({workout.durationWeeks} Weeks)
        </span>
        <h1 className="text-2xl font-extrabold text-white">{workout.title}</h1>
        <p className="text-xs text-slate-400">Assigned by Coach {workout.trainerId?.userId?.name || 'Personal Trainer'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workout.exercises?.map((ex, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-3xl border border-dark-border space-y-4 hover:border-brand-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neon-cyan px-2.5 py-1 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
                {ex.day}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" /> Rest: {ex.restSeconds}s
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{ex.name}</h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-dark-surface p-2.5 rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Sets</div>
                <div className="font-extrabold text-white text-base">{ex.sets}</div>
              </div>
              <div className="bg-dark-surface p-2.5 rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Reps</div>
                <div className="font-extrabold text-brand-400 text-base">{ex.reps}</div>
              </div>
              <div className="bg-dark-surface p-2.5 rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Weight</div>
                <div className="font-extrabold text-neon-amber text-base">{ex.weightKg ? `${ex.weightKg} kg` : 'Bodyweight'}</div>
              </div>
            </div>

            {ex.notes && <p className="text-[11px] text-slate-400 italic">Notes: {ex.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberWorkout;
