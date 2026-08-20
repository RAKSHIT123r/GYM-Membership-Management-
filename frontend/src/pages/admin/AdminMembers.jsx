import React, { useState, useEffect } from 'react';
import { getMembersApi, getTrainersApi, updateMemberApi, deleteMemberApi } from '../../services/api';
import { useBranch } from '../../context/BranchContext';
import ProratedRefundModal from '../../components/admin/ProratedRefundModal';
import { Users, Search, RefreshCw, UserCheck, ShieldCheck, AlertTriangle, DollarSign, Trash2, Edit3 } from 'lucide-react';
import Avatar from '../../components/common/Avatar';

const AdminMembers = () => {
  const { selectedBranchId } = useBranch();
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [refundTargetMember, setRefundTargetMember] = useState(null);

  useEffect(() => {
    loadMembers();
    loadTrainers();
  }, [selectedBranchId, statusFilter]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data } = await getMembersApi({
        branchId: selectedBranchId,
        status: statusFilter || undefined,
        search: search || undefined
      });
      setMembers(data);
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
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssignTrainer = async (memberId, trainerId) => {
    try {
      await updateMemberApi(memberId, { trainerId });
      loadMembers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member account?')) {
      try {
        await deleteMemberApi(memberId);
        setMembers((prev) => prev.filter((m) => m._id !== memberId));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      !search ||
      (m.userId && m.userId.name.toLowerCase().includes(search.toLowerCase())) ||
      (m.userId && m.userId.email.toLowerCase().includes(search.toLowerCase())) ||
      (m.qrCodeToken && m.qrCodeToken.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-400" /> Member Roster Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage memberships, assign personal trainers, & process prorated refunds</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member, email, token..."
              className="glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none w-56"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input rounded-xl px-3 py-2 text-xs text-white bg-dark-surface outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            onClick={loadMembers}
            className="p-2 rounded-xl bg-dark-card hover:bg-dark-border text-slate-300 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="glass-panel rounded-3xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-surface/60 text-slate-400 border-b border-dark-border font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Member Info</th>
                <th className="p-4">Active Plan</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Trainer</th>
                <th className="p-4">QR Token</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading member roster...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No members match search criteria
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m._id} className="hover:bg-dark-card/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.userId?.name} className="w-9 h-9 rounded-xl border border-brand-500/20" />
                        <div>
                          <div className="font-extrabold text-white">{m.userId?.name || 'Member'}</div>
                          <div className="text-[11px] text-slate-400">{m.userId?.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{m.membershipPlanId?.name || 'No Active Plan'}</div>
                      {m.endDate && (
                        <div className="text-[10px] text-slate-400">
                          Expires: {new Date(m.endDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          m.membershipStatus === 'Active'
                            ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                            : m.membershipStatus === 'Expiring Soon'
                            ? 'bg-neon-amber/15 text-neon-amber border border-neon-amber/30'
                            : 'bg-neon-rose/15 text-neon-rose border border-neon-rose/30'
                        }`}
                      >
                        {m.membershipStatus === 'Active' ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {m.membershipStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          value={m.trainerId?._id || ''}
                          onChange={(e) => handleAssignTrainer(m._id, e.target.value)}
                          className="glass-input rounded-lg px-2 py-1 text-xs text-slate-200 bg-dark-surface outline-none"
                        >
                          <option value="">No Trainer Assigned</option>
                          {trainers.map((t) => (
                            <option key={t._id} value={t._id}>
                              {t.userId?.name} ({t.specialization})
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-[11px] text-slate-400">{m.qrCodeToken}</td>

                    <td className="p-4 text-right space-x-2">
                      {m.membershipStatus === 'Active' && (
                        <button
                          onClick={() => setRefundTargetMember(m)}
                          className="px-3 py-1 rounded-lg bg-neon-amber/10 hover:bg-neon-amber/20 text-neon-amber border border-neon-amber/30 text-[11px] font-bold transition-all"
                          title="Calculate & Process Prorated Refund"
                        >
                          <DollarSign className="w-3 h-3 inline mr-1" />
                          Refund
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteMember(m._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-neon-rose hover:bg-neon-rose/10 transition-colors"
                        title="Delete member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prorated Refund Modal */}
      {refundTargetMember && (
        <ProratedRefundModal
          member={refundTargetMember}
          onClose={() => setRefundTargetMember(null)}
          onSuccess={() => {
            setRefundTargetMember(null);
            loadMembers();
          }}
        />
      )}
    </div>
  );
};

export default AdminMembers;
