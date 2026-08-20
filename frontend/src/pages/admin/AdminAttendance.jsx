import React, { useState, useEffect } from 'react';
import { getAttendanceLogsApi } from '../../services/api';
import { useBranch } from '../../context/BranchContext';
import ReceptionScanModal from '../../components/admin/ReceptionScanModal';
import { QrCode, CheckCircle2, AlertOctagon, RefreshCw, Calendar } from 'lucide-react';
import Avatar from '../../components/common/Avatar';

const AdminAttendance = () => {
  const { selectedBranchId } = useBranch();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScanModal, setShowScanModal] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [selectedBranchId]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const { data } = await getAttendanceLogsApi({ branchId: selectedBranchId });
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <QrCode className="w-6 h-6 text-brand-400" /> Attendance & QR Verification Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">Real-time facility access history & QR pass entry status</p>
        </div>

        <button
          onClick={() => setShowScanModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch Reception Scanner</span>
        </button>
      </div>

      <div className="glass-panel rounded-3xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-surface/60 text-slate-400 border-b border-dark-border font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Member Name</th>
                <th className="p-4">Check-in Time</th>
                <th className="p-4">Date</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4">Verifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">Loading check-in logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No attendance logs logged yet</td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l._id} className="hover:bg-dark-card/40 transition-colors">
                    <td className="p-4 font-semibold text-white flex items-center gap-3">
                      <Avatar name={l.memberId?.userId?.name} className="w-8 h-8 rounded-xl" />
                      <div>
                        <div>{l.memberId?.userId?.name || 'Member'}</div>
                        <div className="text-[10px] text-slate-400">{l.memberId?.userId?.email}</div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-200">
                      {new Date(l.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 text-slate-400">{l.date}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                          l.status === 'Granted'
                            ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                            : 'bg-neon-rose/15 text-neon-rose border border-neon-rose/30'
                        }`}
                      >
                        {l.status === 'Granted' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertOctagon className="w-3.5 h-3.5" />}
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{l.verifiedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showScanModal && <ReceptionScanModal onClose={() => setShowScanModal(false)} onScanSuccess={loadLogs} />}
    </div>
  );
};

export default AdminAttendance;
