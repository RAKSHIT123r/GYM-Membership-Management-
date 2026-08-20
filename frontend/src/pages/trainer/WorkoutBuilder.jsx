import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTrainerByIdApi, saveWorkoutApi, getMemberWorkoutApi } from '../../services/api';
import { Dumbbell, Plus, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';

const WorkoutBuilder = () => {
  const { user } = useAuth();
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [title, setTitle] = useState('Custom Strength & Hypertrophy Program');
  const [goal, setGoal] = useState('Muscle Hypertrophy');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [exercises, setExercises] = useState([
    { day: 'Monday', name: 'Barbell Bench Press', sets: 4, reps: '8-10', weightKg: 80, restSeconds: 90 },
    { day: 'Wednesday', name: 'Barbell Back Squat', sets: 4, reps: '8-10', weightKg: 100, restSeconds: 120 },
    { day: 'Friday', name: 'Barbell Deadlift', sets: 4, reps: '5', weightKg: 130, restSeconds: 120 }
  ]);
  const [instructions, setInstructions] = useState('Warm up thoroughly before working sets. Maintain strict form.');
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { day: 'Monday', name: 'Dumbbell Incline Press', sets: 3, reps: '10-12', weightKg: 24, restSeconds: 60 }
    ]);
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    try {
      await saveWorkoutApi({
        memberId: selectedMemberId,
        title,
        goal,
        durationWeeks,
        exercises,
        instructions
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
            <Dumbbell className="w-6 h-6 text-brand-400" /> Interactive Workout Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">Design tailored resistance & hypertrophy plans for assigned gym members</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Plan Saved & Assigned!
          </div>
        )}
      </div>

      <form onSubmit={handleSavePlan} className="space-y-6">
        {/* Select Member & Basic Plan Parameters */}
        <div className="glass-panel p-6 rounded-3xl border border-dark-border grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Select Member Client</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white bg-dark-surface"
              required
            >
              {assignedMembers.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.userId?.name} ({m.fitnessGoal})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Program Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Target Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Duration (Weeks)</label>
            <input
              type="number"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white"
              required
            />
          </div>
        </div>

        {/* Exercises Builder Table */}
        <div className="glass-panel p-6 rounded-3xl border border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Exercise Distribution & Parameters</h3>
            <button
              type="button"
              onClick={handleAddExercise}
              className="px-4 py-2 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 text-brand-400 font-bold text-xs border border-brand-500/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Exercise
            </button>
          </div>

          <div className="space-y-3">
            {exercises.map((ex, idx) => (
              <div key={idx} className="bg-dark-surface p-4 rounded-2xl border border-dark-border grid grid-cols-1 sm:grid-cols-6 gap-3 items-center text-xs">
                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Day</label>
                  <input
                    type="text"
                    value={ex.day}
                    onChange={(e) => handleExerciseChange(idx, 'day', e.target.value)}
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Exercise Name</label>
                  <input
                    type="text"
                    value={ex.name}
                    onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-white font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Sets x Reps</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={ex.sets}
                      onChange={(e) => handleExerciseChange(idx, 'sets', Number(e.target.value))}
                      className="w-1/2 glass-input rounded-lg px-1.5 py-1.5 text-center text-white"
                    />
                    <input
                      type="text"
                      value={ex.reps}
                      onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                      className="w-1/2 glass-input rounded-lg px-1.5 py-1.5 text-center text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Target Weight (kg)</label>
                  <input
                    type="number"
                    value={ex.weightKg}
                    onChange={(e) => handleExerciseChange(idx, 'weightKg', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-white text-center"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Rest (sec)</label>
                    <input
                      type="number"
                      value={ex.restSeconds}
                      onChange={(e) => handleExerciseChange(idx, 'restSeconds', Number(e.target.value))}
                      className="w-20 glass-input rounded-lg px-2 py-1.5 text-white text-center"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(idx)}
                    className="p-2 text-slate-500 hover:text-neon-rose mt-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-sm transition-all shadow-xl shadow-brand-500/25"
        >
          Assign Workout Plan to Member
        </button>
      </form>
    </div>
  );
};

export default WorkoutBuilder;
