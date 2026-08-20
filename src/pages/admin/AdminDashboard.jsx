import React, { useState, useEffect } from 'react';
import { getAdminStatsApi, getAdminAnalyticsApi, getAttendanceLogsApi } from '../../services/api';
import { useBranch } from '../../context/BranchContext';
import StatCard from '../../components/common/StatCard';
import RevenueChart from '../../components/charts/RevenueChart';
import AttendanceChart from '../../components/charts/AttendanceChart';
import ClassPopularityChart from '../../components/charts/ClassPopularityChart';
import ReceptionScanModal from '../../components/admin/ReceptionScanModal';
import { Users, UserCheck, Calendar, DollarSign, QrCode, AlertTriangle, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';
import Avatar from '../../components/common/Avatar';

const AdminDashboard = () => {
  const { selectedBranchId } = useBranch();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScanModal, setShowScanModal] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [selectedBranchId]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [sRes, aRes, attRes] = await Promise.all([
        getAdminStatsApi({ branchId: selectedBranchId }),
        getAdminAnalyticsApi(),
        getAttendanceLogsApi({ branchId: selectedBranchId })
      ]);
      setStats(sRes.data);
      setAnalytics(aRes.data);
      setRecentAttendance(attRes.data.slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-brand-500" />
        <span>Loading Admin Intelligence Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Admin Command Center
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Commercial Gym Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time facility performance, revenue metrics & active check-in tracking</p>
        </div>

        <button
          onClick={() => setShowScanModal(true)}
          className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-xl shadow-brand-500/25 flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch Reception Scanner</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
          color="brand"
          subtext={`${stats.activeMembers} Active Subscriptions`}
          trend="+12%"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="cyan"
          subtext="Processed via Razorpay/Stripe"
          trend="+18%"
        />
        <StatCard
          title="Today's Check-ins"
          value={stats.todayAttendance}
          icon={QrCode}
          color="amber"
          subtext="QR Verified Reception Logs"
          trend="Active"
        />
        <StatCard
          title="Pending Renewals"
          value={stats.pendingRenewals}
          icon={AlertTriangle}
          color="rose"
          subtext={`${stats.expiredMembers} Members Expired`}
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" /> Revenue Growth Trend
              </h3>
              <p className="text-xs text-slate-400">Monthly subscription & renewal cash flow</p>
            </div>
            <span className="text-xs text-brand-400 font-bold px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
              YTD +34%
            </span>
          </div>
          {analytics?.revenueTrend && <RevenueChart data={analytics.revenueTrend} />}
        </div>

        {/* 7-Day Attendance Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-neon-cyan" /> 7-Day Check-in Distribution
              </h3>
              <p className="text-xs text-slate-400">Daily member reception activity</p>
            </div>
            <span className="text-xs text-neon-cyan font-bold px-2.5 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20">
              Peak: Mon & Wed
            </span>
          </div>
          {analytics?.attendanceTrend && <AttendanceChart data={analytics.attendanceTrend} />}
        </div>
      </div>

      {/* Class Popularity & Recent Attendance Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Category Popularity */}
        <div className="glass-panel p-6 rounded-3xl border border-dark-border lg:col-span-1 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neon-purple" /> Category Popularity
          </h3>
          <p className="text-xs text-slate-400">Group class booking volume</p>
          {analytics?.classPopularity && <ClassPopularityChart data={analytics.classPopularity} />}
        </div>

        {/* Recent Reception Verification Log */}
        <div className="glass-panel p-6 rounded-3xl border border-dark-border lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-400" /> Recent Reception Check-in Logs
            </h3>
            <span className="text-xs text-slate-400">Live Kiosk Queue</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-dark-border font-semibold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Member</th>
                  <th className="pb-3">Check-in Time</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Branch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50 text-slate-300">
                {recentAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      No check-ins logged today
                    </td>
                  </tr>
                ) : (
                  recentAttendance.map((log) => (
                    <tr key={log._id} className="hover:bg-dark-card/50 transition-colors">
                      <td className="py-3 font-semibold text-white flex items-center gap-2">
                        <Avatar name={log.memberId?.userId?.name} className="w-7 h-7 rounded-lg" />
                        <span>{log.memberId?.userId?.name || 'Member'}</span>
                      </td>
                      <td className="py-3 font-mono">{new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'Granted' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'bg-neon-rose/10 text-neon-rose border border-neon-rose/20'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{log.branchId?.name || 'Main Gym'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reception Scanner Modal */}
      {showScanModal && <ReceptionScanModal onClose={() => setShowScanModal(false)} onScanSuccess={loadDashboard} />}
    </div>
  );
};

export default AdminDashboard;
