import React, { useState, useEffect } from 'react';
import { getClassesApi, createClassApi, deleteClassApi, getTrainersApi } from '../../services/api';
import { useBranch } from '../../context/BranchContext';
import { Calendar, Plus, Users, Clock, Trash2, X, RefreshCw } from 'lucide-react';

const AdminClasses = () => {
  const { selectedBranchId } = useBranch();
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    category: 'CrossFit',
    trainerId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00 AM',
    endTime: '09:00 AM',
    capacity: 15,
    description: ''
  });

  useEffect(() => {
    loadClasses();
    loadTrainers();
  }, [selectedBranchId]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const { data } = await getClassesApi({ branchId: selectedBranchId });
      setClasses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadTrainers = async () => {
    try {
      const { data } = await getTrainersApi({ branchId: selectedBranchId });
      setTrainers(data);
      if (data.length > 0) {
        setNewClass((prev) => ({ ...prev, trainerId: data[0]._id }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createClassApi({ ...newClass, branchId: selectedBranchId });
      setShowModal(false);
      loadClasses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete class schedule?')) {
      try {
        await deleteClassApi(id);
        setClasses((prev) => prev.filter((c) => c._id !== id));
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
            <Calendar className="w-6 h-6 text-neon-cyan" /> Class Schedule & Waitlists
          </h1>
          <p className="text-xs text-slate-400 mt-1">Schedule group fitness classes, trainer assignments, capacities & auto-waitlists</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Class</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading class schedule...</div>
        ) : classes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">No classes scheduled in this branch</div>
        ) : (
          classes.map((c) => (
            <div key={c._id} className="glass-card rounded-3xl p-6 border border-dark-border space-y-4 relative group hover:border-brand-500/30 transition-all">
              <button
                onClick={() => handleDelete(c._id)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-neon-rose opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan uppercase">
                  {c.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{c.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{c.description || 'High intensity fitness training'}</p>
              </div>

              <div className="bg-dark-surface p-3.5 rounded-2xl border border-dark-border text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-400" /> {c.startTime} - {c.endTime}</span>
                  <span className="text-slate-400">{c.date}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-dark-border/50">
                  <span className="text-slate-400">Trainer:</span>
                  <strong className="text-white">{c.trainerId?.userId?.name || 'Assigned Coach'}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Capacity & Seats:</span>
                  <span className={`font-bold ${c.bookedSeats >= c.capacity ? 'text-neon-rose' : 'text-brand-400'}`}>
                    {c.bookedSeats} / {c.capacity} Booked {c.bookedSeats >= c.capacity && '(FULL)'}
                  </span>
                </div>
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
            <h3 className="text-lg font-bold text-white mb-4">Schedule Fitness Class</h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Class Title</label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  placeholder="e.g. Power CrossFit Shred"
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newClass.category}
                    onChange={(e) => setNewClass({ ...newClass, category: e.target.value })}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-white bg-dark-surface"
                  >
                    <option value="CrossFit">CrossFit</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Zumba">Zumba</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Boxing">Boxing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Trainer</label>
                  <select
                    value={newClass.trainerId}
                    onChange={(e) => setNewClass({ ...newClass, trainerId: e.target.value })}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-white bg-dark-surface"
                    required
                  >
                    {trainers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.userId?.name} ({t.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={newClass.date}
                    onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                    className="w-full glass-input rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newClass.startTime}
                    onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                    placeholder="07:00 AM"
                    className="w-full glass-input rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={newClass.capacity}
                    onChange={(e) => setNewClass({ ...newClass, capacity: Number(e.target.value) })}
                    className="w-full glass-input rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 mt-4"
              >
                Schedule Class
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClasses;
