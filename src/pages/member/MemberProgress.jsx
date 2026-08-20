import React, { useState, useEffect } from 'react';
import { getProgressHistoryApi, addProgressApi } from '../../services/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Plus, Award, RefreshCw, X } from 'lucide-react';

const MemberProgress = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLog, setNewLog] = useState({
    weightKg: 78.5,
    bodyFatPercentage: 15.0,
    chestCm: 104,
    waistCm: 80,
    armCm: 39,
    notes: 'Feeling energized!'
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const { data } = await getProgressHistoryApi('my');
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
      await addProgressApi(newLog);
      setShowModal(false);
      loadProgress();
    } catch (e) {
      console.error(e);
    }
  };

  const chartData = history.map((h) => ({
    date: new Date(h.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    weight: h.weightKg,
    bodyFat: h.bodyFatPercentage
  }));

  const latest = history[history.length - 1] || null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-400" /> Fitness Progress Tracking
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track body weight trends, BMI, body fat %, and personal record milestones</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Log Weight & Stats</span>
        </button>
      </div>

      {/* Latest Stats Banner */}
      {latest && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-dark-border text-center">
            <div className="text-xs text-slate-400">Current Weight</div>
            <div className="text-2xl font-extrabold text-white mt-1">{latest.weightKg} kg</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-dark-border text-center">
            <div className="text-xs text-slate-400">Body Fat %</div>
            <div className="text-2xl font-extrabold text-brand-400 mt-1">{latest.bodyFatPercentage}%</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-dark-border text-center">
            <div className="text-xs text-slate-400">BMI</div>
            <div className="text-2xl font-extrabold text-neon-cyan mt-1">{latest.bmi}</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-dark-border text-center">
            <div className="text-xs text-slate-400">Arm Size</div>
            <div className="text-2xl font-extrabold text-neon-amber mt-1">{latest.armCm} cm</div>
          </div>
        </div>
      )}

      {/* Weight Progress Line Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-dark-border space-y-4">
        <h3 className="text-base font-bold text-white">Body Weight & Composition Trajectory</h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A303F" vertical={false} />
              <XAxis dataKey="date" stroke="#8E9BB0" fontSize={11} />
              <YAxis stroke="#8E9BB0" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={{ backgroundColor: '#14171F', borderColor: '#2A303F', borderRadius: '12px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={3} dot={{ r: 5, fill: '#22c55e' }} name="Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Measurement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-md rounded-3xl border border-dark-border p-6 relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Log Fitness Progress Measurement</h3>

            <form onSubmit={handleAddLog} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLog.weightKg}
                    onChange={(e) => setNewLog({ ...newLog, weightKg: Number(e.target.value) })}
                    className="w-full glass-input rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Body Fat %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLog.bodyFatPercentage}
                    onChange={(e) => setNewLog({ ...newLog, bodyFatPercentage: Number(e.target.value) })}
                    className="w-full glass-input rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    value={newLog.chestCm}
                    onChange={(e) => setNewLog({ ...newLog, chestCm: Number(e.target.value) })}
                    className="w-full glass-input rounded-xl px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    value={newLog.waistCm}
                    onChange={(e) => setNewLog({ ...newLog, waistCm: Number(e.target.value) })}
                    className="w-full glass-input rounded-xl px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Arm (cm)</label>
                  <input
                    type="number"
                    value={newLog.armCm}
                    onChange={(e) => setNewLog({ ...newLog, armCm: Number(e.target.value) })}
                    className="w-full glass-input rounded-xl px-2.5 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 mt-4"
              >
                Save Progress Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProgress;
