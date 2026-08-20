import React, { useState, useEffect } from 'react';
import { getPlansApi, createPlanApi, updatePlanApi, deletePlanApi } from '../../services/api';
import { Sparkles, Plus, Check, Edit2, Trash2, X } from 'lucide-react';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    durationDays: 30,
    price: 2999,
    description: '',
    features: 'Single Branch Access, Full Gym Equipment, Locker Access',
    accessLevel: 'Standard',
    classAccess: true,
    branchAccess: 'Single Branch'
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const { data } = await getPlansApi();
      setPlans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditPlan(plan);
      setFormData({
        name: plan.name,
        durationDays: plan.durationDays,
        price: plan.price,
        description: plan.description,
        features: plan.features ? plan.features.join(', ') : '',
        accessLevel: plan.accessLevel,
        classAccess: plan.classAccess,
        branchAccess: plan.branchAccess
      });
    } else {
      setEditPlan(null);
      setFormData({
        name: '',
        durationDays: 30,
        price: 2999,
        description: '',
        features: 'Single Branch Access, Group Classes, Locker Access',
        accessLevel: 'Standard',
        classAccess: true,
        branchAccess: 'Single Branch'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const featureArray = formData.features.split(',').map((f) => f.trim());
      const payload = { ...formData, features: featureArray };

      if (editPlan) {
        await updatePlanApi(editPlan._id, payload);
      } else {
        await createPlanApi(payload);
      }
      setShowModal(false);
      loadPlans();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deactivate this membership plan?')) {
      try {
        await deletePlanApi(id);
        setPlans((prev) => prev.filter((p) => p._id !== id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-400" /> Membership Plan Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure subscription pricing tiers, feature access levels, and auto-renewal defaults</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading plans...</div>
        ) : (
          plans.map((p) => (
            <div key={p._id} className="glass-card rounded-3xl p-6 border border-dark-border flex flex-col justify-between relative group hover:border-brand-500/40 transition-all">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(p)} className="p-1.5 text-slate-400 hover:text-white">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p._id)} className="p-1.5 text-slate-400 hover:text-neon-rose">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 uppercase tracking-wider">
                  {p.accessLevel}
                </span>
                <h3 className="text-lg font-bold text-white mt-2 mb-1">{p.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{p.description}</p>
                <div className="text-3xl font-extrabold text-white mb-6">
                  ₹{p.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {p.durationDays} Days</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  {p.features?.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-dark-border text-[11px] text-slate-400 flex justify-between">
                <span>Classes: {p.classAccess ? 'Included' : 'Excluded'}</span>
                <span>{p.branchAccess}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg rounded-3xl border border-dark-border p-6 relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">{editPlan ? 'Edit Membership Plan' : 'Create Membership Plan'}</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Plan Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Standard 3 Months"
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-white h-20"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 mt-4"
              >
                Save Plan Configuration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;
