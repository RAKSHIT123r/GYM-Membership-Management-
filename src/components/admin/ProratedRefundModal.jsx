import React, { useEffect, useState } from 'react';
import { refundPreviewApi, processRefundApi } from '../../services/api';
import { X, DollarSign, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

const ProratedRefundModal = ({ member, onClose, onSuccess }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [reason, setReason] = useState('Relocation / Personal preference');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchPreview();
  }, [member]);

  const fetchPreview = async () => {
    try {
      const { data } = await refundPreviewApi({ memberId: member._id });
      setPreview(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = async () => {
    setProcessing(true);
    try {
      const { data } = await processRefundApi({ memberId: member._id, reason });
      setResult(data);
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-lg rounded-3xl border border-dark-border p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-dark-surface text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-neon-amber/10 border border-neon-amber/30 flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-neon-amber" />
          </div>
          <h3 className="text-lg font-bold text-white">Prorated Refund Calculation</h3>
          <p className="text-xs text-slate-400">Cancel active membership and calculate exact daily-rate refund</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Calculating daily rate...</div>
        ) : result ? (
          <div className="bg-brand-500/10 border border-brand-500/30 p-5 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-brand-400 mx-auto" />
            <div className="font-extrabold text-white text-base">{result.message}</div>
            <div className="text-xs text-slate-400 font-mono">Transaction ID: {result.transactionId}</div>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-xl bg-brand-500 text-black font-extrabold text-xs"
            >
              Done
            </button>
          </div>
        ) : preview ? (
          <div className="space-y-5">
            <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-3 text-xs">
              <div className="flex justify-between border-b border-dark-border pb-2">
                <span className="text-slate-400">Member:</span>
                <strong className="text-white">{member.userId ? member.userId.name : 'Member'}</strong>
              </div>
              <div className="flex justify-between border-b border-dark-border pb-2">
                <span className="text-slate-400">Active Plan:</span>
                <span className="text-white font-semibold">{preview.planName} (₹{preview.totalPrice.toLocaleString()})</span>
              </div>
              <div className="flex justify-between border-b border-dark-border pb-2">
                <span className="text-slate-400">Daily Membership Rate:</span>
                <span className="text-slate-200">₹{preview.dailyRate} / day</span>
              </div>
              <div className="flex justify-between border-b border-dark-border pb-2">
                <span className="text-slate-400">Unused Days Remaining:</span>
                <span className="text-neon-cyan font-bold">{preview.unusedDays} Days</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-200 font-bold text-sm">Calculated Prorated Refund:</span>
                <span className="text-neon-amber font-extrabold text-base">₹{preview.calculatedRefund.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Cancellation Reason</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-dark-border text-slate-300 text-xs font-semibold hover:bg-dark-surface"
              >
                Keep Plan Active
              </button>
              <button
                onClick={handleProcessRefund}
                disabled={processing}
                className="flex-1 py-2.5 rounded-xl bg-neon-amber hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/20"
              >
                {processing ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : `Approve & Refund ₹${preview.calculatedRefund}`}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-neon-rose text-xs py-6">Unable to compute refund for this member</div>
        )}
      </div>
    </div>
  );
};

export default ProratedRefundModal;
