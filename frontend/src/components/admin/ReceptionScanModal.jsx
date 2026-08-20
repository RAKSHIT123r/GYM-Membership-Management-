import React, { useState } from 'react';
import { checkInMemberApi } from '../../services/api';
import { X, QrCode, ShieldCheck, AlertOctagon, CheckCircle2, RefreshCw } from 'lucide-react';

const ReceptionScanModal = ({ onClose, onScanSuccess }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!tokenInput.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const { data } = await checkInMemberApi({ qrToken: tokenInput.trim() });
      setResult(data);
      if (onScanSuccess) onScanSuccess();
    } catch (err) {
      if (err.response && err.response.data) {
        setResult(err.response.data);
      } else {
        setErrorMsg('Verification failed. Token not found.');
      }
    } finally {
      setLoading(false);
    }
  };

  const QuickDemoScan = (token) => {
    setTokenInput(token);
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
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-6 h-6 text-brand-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Reception QR Verification Scanner</h3>
          <p className="text-xs text-slate-400">Scan or type Member QR Token to grant/deny facility entry</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">QR Pass Token</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="e.g. APEX-JOHN77-1001"
                className="flex-1 glass-input rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !tokenInput}
                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-md shadow-brand-500/20 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify'}
              </button>
            </div>
          </div>

          {/* Quick Demo Pre-fill helper */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <span>Quick Test:</span>
            <button
              type="button"
              onClick={() => QuickDemoScan('APEX-JOHN77-1001')}
              className="text-brand-400 underline hover:text-brand-300"
            >
              Active Member (John)
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => QuickDemoScan('APEX-MICHAEL-EXP1')}
              className="text-neon-rose underline hover:text-rose-400"
            >
              Expired Member (Michael)
            </button>
          </div>
        </form>

        {/* Verification Result Display */}
        {result && (
          <div
            className={`p-5 rounded-2xl border text-center space-y-3 animate-in fade-in duration-200 ${
              result.status === 'Granted' || result.success
                ? 'bg-brand-500/10 border-brand-500/30 text-slate-100'
                : 'bg-neon-rose/10 border-neon-rose/30 text-slate-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {result.status === 'Granted' || result.success ? (
                <CheckCircle2 className="w-8 h-8 text-brand-400" />
              ) : (
                <AlertOctagon className="w-8 h-8 text-neon-rose" />
              )}
            </div>

            <div className="font-extrabold text-base">{result.message}</div>

            {result.member && (
              <div className="bg-dark-surface p-3.5 rounded-xl border border-dark-border text-left text-xs space-y-1">
                <div><span className="text-slate-400">Member:</span> <strong>{result.member.name}</strong></div>
                <div><span className="text-slate-400">Plan:</span> {result.member.plan}</div>
                <div><span className="text-slate-400">Status:</span> <span className="font-bold">{result.member.status}</span></div>
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-neon-rose/10 border border-neon-rose/30 text-neon-rose text-xs text-center">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionScanModal;
