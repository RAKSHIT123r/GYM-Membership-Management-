import React, { useState, useEffect } from 'react';
import { getPaymentHistoryApi } from '../../services/api';
import { CreditCard, Download, Search, ShieldCheck, RefreshCw, DollarSign } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const { data } = await getPaymentHistoryApi();
      setPayments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter(
    (p) =>
      !search ||
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      (p.memberId?.userId?.name && p.memberId.userId.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-400" /> Revenue & Payment Audit Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">Transaction history, gateway receipts (Razorpay/Stripe), & refund logs</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Transaction ID or Member..."
              className="glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none w-56"
            />
          </div>
          <button onClick={loadPayments} className="p-2 rounded-xl bg-dark-card text-slate-300">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-surface/60 text-slate-400 border-b border-dark-border font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Member</th>
                <th className="p-4">Type & Gateway</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading payment ledger...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No payment logs found</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-dark-card/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{p.transactionId}</td>
                    <td className="p-4 font-semibold text-slate-200">{p.memberId?.userId?.name || 'Member'}</td>
                    <td className="p-4">
                      <div className="text-slate-200 font-medium">{p.paymentType}</div>
                      <div className="text-[10px] text-slate-400">{p.paymentMethod}</div>
                    </td>
                    <td className="p-4 font-extrabold text-base text-brand-400">₹{p.amount?.toLocaleString()}</td>
                    <td className="p-4 text-slate-400">{new Date(p.date).toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === 'Success'
                            ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                            : p.status === 'Refunded'
                            ? 'bg-neon-amber/15 text-neon-amber border border-neon-amber/30'
                            : 'bg-neon-rose/15 text-neon-rose border border-neon-rose/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
