import React, { useState, useEffect } from 'react';
import { getTrainersApi, createTrainerApi, deleteTrainerApi } from '../../services/api';
import { useBranch } from '../../context/BranchContext';
import { UserCheck, Plus, Award, Star, Mail, Phone, Trash2, X, RefreshCw } from 'lucide-react';
import Avatar from '../../components/common/Avatar';

const AdminTrainers = () => {
  const { selectedBranchId, branches } = useBranch();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'Bodybuilding & Powerlifting',
    experienceYears: 4,
    certifications: 'NSCA Certified Coach, NASM Master Trainer',
    bio: '',
    branchId: selectedBranchId
  });

  useEffect(() => {
    loadTrainers();
  }, [selectedBranchId]);

  const loadTrainers = async () => {
    setLoading(true);
    try {
      const { data } = await getTrainersApi({ branchId: selectedBranchId });
      setTrainers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    try {
      const certArray = newTrainer.certifications.split(',').map((c) => c.trim());
      await createTrainerApi({ ...newTrainer, certifications: certArray, branchId: selectedBranchId });
      setShowAddModal(false);
      loadTrainers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTrainer = async (id) => {
    if (window.confirm('Delete trainer profile?')) {
      try {
        await deleteTrainerApi(id);
        setTrainers((prev) => prev.filter((t) => t._id !== id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-neon-amber" /> Trainer Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage certified fitness coaches, specializations, and branch assignments</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Trainer</span>
        </button>
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading personal trainers...</div>
        ) : trainers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">No trainers registered in this branch</div>
        ) : (
          trainers.map((t) => (
            <div key={t._id} className="glass-card rounded-3xl p-6 border border-dark-border space-y-4 relative group hover:border-brand-500/30 transition-all">
              <button
                onClick={() => handleDeleteTrainer(t._id)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-neon-rose transition-colors opacity-0 group-hover:opacity-100"
                title="Remove trainer"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4">
                <Avatar name={t.userId?.name} className="w-14 h-14 rounded-2xl border-2 border-brand-500/30" />
                <div>
                  <h3 className="font-extrabold text-white text-base">{t.userId?.name || 'Coach'}</h3>
                  <div className="text-xs text-brand-400 font-semibold">{t.specialization}</div>
                  <div className="flex items-center gap-1 text-xs text-neon-amber font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-neon-amber" />
                    <span>{t.rating || 4.9} / 5.0</span>
                    <span className="text-slate-500 font-normal ml-1">({t.experienceYears} yrs exp)</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-surface p-3 rounded-2xl border border-dark-border text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.userId?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.userId?.phone || '+1 (555) 000-0000'}</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-neon-cyan" /> Certifications
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {t.certifications?.map((cert, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] font-semibold">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Trainer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg rounded-3xl border border-dark-border p-6 relative shadow-2xl">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Register New Fitness Trainer</h3>

            <form onSubmit={handleCreateTrainer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={newTrainer.name}
                  onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                  placeholder="Coach Marcus"
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newTrainer.email}
                    onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
                    placeholder="marcus@apexfit.com"
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newTrainer.phone}
                    onChange={(e) => setNewTrainer({ ...newTrainer, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Specialization</label>
                <input
                  type="text"
                  value={newTrainer.specialization}
                  onChange={(e) => setNewTrainer({ ...newTrainer, specialization: e.target.value })}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Certifications (comma separated)</label>
                <input
                  type="text"
                  value={newTrainer.certifications}
                  onChange={(e) => setNewTrainer({ ...newTrainer, certifications: e.target.value })}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 mt-4"
              >
                Create Trainer Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrainers;
