import React, { useEffect, useState } from 'react';
import { getMemberQRApi } from '../../services/api';
import { X, QrCode, ShieldCheck, Download, AlertTriangle } from 'lucide-react';

const QRModal = ({ onClose }) => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQR();
  }, []);

  const fetchQR = async () => {
    try {
      const { data } = await getMemberQRApi();
      setQrData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-md rounded-3xl border border-dark-border p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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
          <h3 className="text-lg font-bold text-white">Digital Membership Pass</h3>
          <p className="text-xs text-slate-400">Scan at the gym reception desk for instant check-in</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Generating secure QR code...</div>
        ) : qrData ? (
          <div className="space-y-5">
            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl w-56 h-56 mx-auto flex items-center justify-center shadow-xl">
              <img src={qrData.qrDataUrl} alt="Member QR Code" className="w-full h-full object-contain" />
            </div>

            {/* Member & Status Badge */}
            <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border text-center space-y-2">
              <div className="font-extrabold text-base text-white">{qrData.memberName}</div>
              <div className="text-xs text-slate-400 font-mono">Token: {qrData.qrToken}</div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    qrData.status === 'Active'
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                      : 'bg-neon-rose/15 text-neon-rose border border-neon-rose/30'
                  }`}
                >
                  {qrData.status === 'Active' ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {qrData.status} ({qrData.planName})
                </span>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-500">
              Valid until: {qrData.expiryDate ? new Date(qrData.expiryDate).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        ) : (
          <div className="text-center text-neon-rose text-xs py-6">Failed to load QR code</div>
        )}
      </div>
    </div>
  );
};

export default QRModal;
