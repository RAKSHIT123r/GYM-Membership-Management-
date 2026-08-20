import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/common/Avatar';
import { getTrainerByIdApi, getClassesApi } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import { Users, Calendar, Dumbbell, Apple, Sparkles, UserCheck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrainerDashboard = () => {
  const { user, justRegistered, clearJustRegistered } = useAuth();
  const [trainerData, setTrainerData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user?.roleDetails?._id) {
      loadTrainerInfo();
    } else {
      // If there is no trainer roleDetails (not a trainer or data missing), stop loading
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (justRegistered) {
      clearJustRegistered();
    }
  }, [justRegistered, clearJustRegistered]);

  const loadTrainerInfo = async () => {
    setLoading(true);
    try {
      const { data } = await getTrainerByIdApi(user.roleDetails._id);
      setTrainerData(data);
    } catch (e) {
      console.error(e);
      setTrainerData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-brand-500" />
        <span>Loading Trainer Portal...</span>
      </div>
    );
  }

  if (!trainerData) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="text-lg font-bold text-white mb-2">Trainer data unavailable</div>
        <div className="text-sm">If you are a trainer, try reloading or contact the administrator.</div>
      </div>
    );
  }

  

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} className="w-16 h-16 rounded-2xl border-2 border-brand-500/30 shadow-lg" />
          <div>
            <div className="flex items-center gap-2 text-neon-amber text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Personal Coach Dashboard
            </div>
            <h1 className="text-2xl font-extrabold text-white">{justRegistered ? `Welcome, ${user.name}!` : `Welcome back, ${user.name}!`}</h1>
            <p className="text-xs text-slate-400 mt-1">Specialization: {trainerData.trainer.specialization}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/trainer/workouts"
            className="px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Create Workout Plan</span>
          </Link>
          <Link
            to="/trainer/nutrition"
            className="px-4 py-2.5 rounded-2xl glass-panel hover:border-slate-500 text-white font-bold text-xs transition-all flex items-center gap-2"
          >
            <Apple className="w-4 h-4 text-brand-400" />
            <span>Build Nutrition</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Members"
          value={trainerData.assignedMembers?.length || 0}
          icon={Users}
          color="brand"
          subtext="Active Personal Training Clients"
        />
        <StatCard
          title="Scheduled Classes"
          value={trainerData.classes?.length || 0}
          icon={Calendar}
          color="amber"
          subtext="Group Fitness Sessions"
        />
        <StatCard
          title="Coach Rating"
          value={`${trainerData.trainer.rating || 4.9} ★`}
          icon={UserCheck}
          color="purple"
          subtext="Client Feedback Score"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Members List */}
        <div className="glass-panel p-6 rounded-3xl border border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" /> Assigned Member Clients
            </h3>
            <Link to="/trainer/members" className="text-xs text-brand-400 hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {trainerData.assignedMembers?.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No members assigned yet</p>
            ) : (
              trainerData.assignedMembers?.map((m) => (
                <div key={m._id} className="bg-dark-surface p-4 rounded-2xl border border-dark-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.userId?.name} className="w-10 h-10 rounded-xl" />
                    <div>
                      <div className="font-extrabold text-white text-xs">{m.userId?.name}</div>
                      <div className="text-[11px] text-slate-400">Goal: {m.fitnessGoal}</div>
                    </div>
                  </div>

                  <Link
                    to="/trainer/workouts"
                    className="px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500 text-brand-400 hover:text-black text-xs font-bold transition-all"
                  >
                    Edit Plans
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assigned Classes Schedule */}
        <div className="glass-panel p-6 rounded-3xl border border-dark-border space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neon-amber" /> My Class Schedule
          </h3>

          <div className="space-y-3">
            {trainerData.classes?.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No classes scheduled</p>
            ) : (
              trainerData.classes?.map((c) => (
                <div key={c._id} className="bg-dark-surface p-4 rounded-2xl border border-dark-border flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-white text-xs">{c.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {c.date} | {c.startTime} - {c.endTime}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                    {c.bookedSeats} / {c.capacity} Booked
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
