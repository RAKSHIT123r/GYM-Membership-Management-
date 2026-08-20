import React, { useState } from 'react';
import { useBranch } from '../../context/BranchContext';
import { createBranchApi } from '../../services/api';
import { Building, Plus, MapPin, Phone, Mail, Clock, X } from 'lucide-react';

const AdminBranches = () => {
  const { branches, fetchBranches } = useBranch();
  const [showModal, setShowModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '5:00 AM - 11:00 PM',
    capacity: 250
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createBranchApi(newBranch);
      setShowModal(false);
      fetchBranches();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-neon-purple" /> Multi-Branch Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage gym facilities, location addresses, hours & capacity limits</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Branch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((b) => (
          <div key={b._id} className="glass-card rounded-3xl p-6 border border-dark-border space-y-4 hover:border-brand-500/30 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-white">{b.name}</h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Capacity: {b.capacity} Members
              </span>
            </div>

            <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-neon-purple shrink-0" />
                <span>{b.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{b.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{b.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 pt-1 border-t border-dark-border/50">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span className="font-semibold text-white">{b.openingHours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg rounded-3xl border border-dark-border p-6 relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Add Gym Branch Location</h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Branch Name</label>
                <input
                  type="text"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  placeholder="Uptown Express Gym"
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  placeholder="450 Uptown Avenue, District 4"
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                    placeholder="+1 (555) 999-8888"
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newBranch.capacity}
                    onChange={(e) => setNewBranch({ ...newBranch, capacity: Number(e.target.value) })}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 mt-4"
              >
                Create Gym Branch
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBranches;
