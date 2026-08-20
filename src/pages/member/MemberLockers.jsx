import React, { useState, useEffect } from 'react';
import { getLockersApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';

const MemberLockers = () => {
  const { user } = useAuth();
  const [assignedLocker, setAssignedLocker] = useState(null);
  const [loading, setLoading] = useState(true);

  const member = user?.roleDetails;

  useEffect(() => {
    if (member?._id) {
      loadLocker();
    } else {
      setLoading(false);
    }
  }, [member]);

  const loadLocker = async () => {
    try {
      const { data } = await getLockersApi({ status: 'Assigned' });
      const myLocker = data.find((l) => l.assignedToMemberId?._id === member._id);
      setAssignedLocker(myLocker || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Checking locker status...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      <div className="glass-card p-6 rounded-3xl border border-dark-border space-y-2 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto mb-2">
          <Lock className="w-6 h-6 text-brand-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Assigned Facility Locker</h1>
        <p className="text-xs text-slate-400">View your assigned gym locker number and key details</p>
      </div>

      {assignedLocker ? (
        <div className="glass-panel p-8 rounded-3xl border border-brand-500/30 text-center space-y-4 shadow-xl">
          <div className="text-xs font-bold text-brand-400 uppercase tracking-widest">Locker Number</div>
          <div className="text-5xl font-extrabold text-white font-mono">{assignedLocker.lockerNumber}</div>

          <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border text-xs text-slate-300 space-y-1">
            <div>Location: {assignedLocker.branchId?.name || 'Main Gym Hall'}</div>
            <div>Assigned On: {new Date(assignedLocker.assignedDate).toLocaleDateString()}</div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl border border-dark-border text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-neon-amber mx-auto" />
          <h3 className="text-base font-bold text-white">No Locker Assigned</h3>
          <p className="text-xs text-slate-400">
            Lockers are included with Standard Pro & Premium plans. Request locker assignment at the gym reception desk!
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberLockers;
