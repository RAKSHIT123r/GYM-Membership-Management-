import React, { useState, useEffect } from 'react';
import { getLockersApi, assignLockerApi, releaseLockerApi, getMembersApi } from '../../services/api';
import { useBranch } from '../../context/BranchContext';
import { Lock, Unlock, ShieldAlert, Plus, UserCheck, X } from 'lucide-react';

const AdminLockers = () => {
  const { selectedBranchId } = useBranch();
  const [lockers, setLockers] = useState([]);
  const [members, setMembers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [assignMemberId, setAssignMemberId] = useState('');

  useEffect(() => {
    loadLockers();
    loadMembers();
  }, [selectedBranchId, statusFilter]);

  const loadLockers = async () => {
    setLoading(true);
    try {
      const { data } = await getLockersApi({ branchId: selectedBranchId, status: statusFilter || undefined });
      setLockers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      const { data } = await getMembersApi({ branchId: selectedBranchId });
      setMembers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedLocker || !assignMemberId) return;
    try {
      await assignLockerApi(selectedLocker._id, { memberId: assignMemberId });
      setSelectedLocker(null);
      loadLockers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRelease = async (lockerId) => {
    if (window.confirm('Release this locker back to Available pool?')) {
      try {
        await releaseLockerApi(lockerId);
        loadLockers();
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
            <Lock className="w-6 h-6 text-brand-400" /> Facility Locker Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Assign gym lockers to members, track maintenance, and release availability</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="glass-input rounded-xl px-4 py-2 text-xs text-white bg-dark-surface outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      {/* Locker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading lockers grid...</div>
        ) : lockers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">No lockers configured for this branch</div>
        ) : (
          lockers.map((l) => (
            <div
              key={l._id}
              className={`glass-card rounded-2xl p-4 border text-center relative space-y-2 transition-all ${
                l.status === 'Assigned'
                  ? 'border-brand-500/30 bg-brand-500/5'
                  : l.status === 'Maintenance'
                  ? 'border-neon-amber/30 bg-neon-amber/5'
                  : 'border-dark-border hover:border-slate-500'
              }`}
            >
              <div className="text-lg font-extrabold text-white font-mono">{l.lockerNumber}</div>

              <div className="text-[10px] font-bold">
                {l.status === 'Assigned' ? (
                  <span className="text-brand-400 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Assigned
                  </span>
                ) : l.status === 'Maintenance' ? (
                  <span className="text-neon-amber flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Maint.
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center justify-center gap-1">
                    <Unlock className="w-3 h-3 text-brand-500" /> Free
                  </span>
                )}
              </div>

              {l.assignedToMemberId && (
                <div className="text-[11px] font-semibold text-slate-300 truncate">
                  {l.assignedToMemberId.userId?.name || 'Member'}
                </div>
              )}

              <div className="pt-2">
                {l.status === 'Available' ? (
                  <button
                    onClick={() => {
                      setSelectedLocker(l);
                      setAssignMemberId(members[0]?._id || '');
                    }}
                    className="w-full py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500 text-brand-400 hover:text-black font-extrabold text-[11px] border border-brand-500/20"
                  >
                    Assign
                  </button>
                ) : l.status === 'Assigned' ? (
                  <button
                    onClick={() => handleRelease(l._id)}
                    className="w-full py-1 rounded-lg bg-dark-surface hover:bg-neon-rose/20 text-slate-400 hover:text-neon-rose text-[10px] font-semibold"
                  >
                    Release
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500">Unavailable</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign Locker Modal */}
      {selectedLocker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-md rounded-3xl border border-dark-border p-6 relative shadow-2xl">
            <button onClick={() => setSelectedLocker(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2">Assign Locker #{selectedLocker.lockerNumber}</h3>
            <p className="text-xs text-slate-400 mb-4">Select an active gym member to reserve this locker</p>

            <form onSubmit={handleAssign} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Member</label>
                <select
                  value={assignMemberId}
                  onChange={(e) => setAssignMemberId(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-white bg-dark-surface"
                  required
                >
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.userId?.name} ({m.membershipStatus})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20"
              >
                Confirm Locker Assignment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLockers;
