import React, { useState, useEffect } from 'react';
import { getPaymentHistoryApi } from '../../services/api';
import { CreditCard, Download, ShieldCheck, FileText } from 'lucide-react';

const MemberPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDownloadInvoice = (txn) => {
    const invoiceHtml = `
      <html>
        <head><title>ApexFit Official Invoice - ${txn.transactionId}</title></head>
        <body style="font-family: sans-serif; padding: 40px; background: #0B0D10; color: #fff;">
          <h1 style="color: #22c55e;">APEXFIT GYM PLATFORM INVOICE</h1>
          <p>Transaction ID: ${txn.transactionId}</p>
          <p>Date: ${new Date(txn.date).toLocaleString()}</p>
          <p>Payment Method: ${txn.paymentMethod}</p>
          <p>Type: ${txn.paymentType}</p>
          <h2>Amount Paid: ₹${txn.amount?.toLocaleString()}</h2>
          <hr />
          <p style="color: #8E9BB0;">Thank you for training with ApexFit Commercial Gyms!</p>
        </body>
      </html>
    `;
    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${txn.transactionId}.html`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="glass-card p-6 rounded-3xl border border-dark-border">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-brand-400" /> Billing History & Invoices
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review membership payment transactions and download receipts</p>
      </div>

      <div className="glass-panel rounded-3xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-surface/60 text-slate-400 border-b border-dark-border font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Description</th>
                <th className="p-4">Gateway</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading payment history...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No payment history found</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-dark-card/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{p.transactionId}</td>
                    <td className="p-4 font-semibold text-slate-200">{p.paymentType}</td>
                    <td className="p-4 text-slate-400">{p.paymentMethod}</td>
                    <td className="p-4 font-extrabold text-brand-400 text-sm">₹{p.amount?.toLocaleString()}</td>
                    <td className="p-4 text-slate-400">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(p)}
                        className="px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500 text-brand-400 hover:text-black font-bold text-xs transition-all border border-brand-500/20 inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
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

export default MemberPayments;
