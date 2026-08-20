import React, { useState, useEffect } from 'react';
import { getPlansApi, processPaymentApi, updateMemberApi, refundPreviewApi, processRefundApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProratedRefundModal from '../../components/admin/ProratedRefundModal';
import { Sparkles, Check, ShieldCheck, RefreshCw, CreditCard, X, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

const MemberPlans = () => {
  const { user, reloadUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [processing, setProcessing] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const member = user?.roleDetails;

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const { data } = await getPlansApi();
      setPlans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoRenew = async () => {
    if (!member) return;
    try {
      await updateMemberApi(member._id, { autoRenew: !member.autoRenew });
      reloadUser();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExecutePayment = async (e) => {
    e.preventDefault();
    if (!selectedPlanForCheckout) return;

    setProcessing(true);
    try {
      await processPaymentApi({
        planId: selectedPlanForCheckout._id,
        paymentMethod,
        autoRenew: true
      });

      // Celebration effect!
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      setSelectedPlanForCheckout(null);
      await reloadUser();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-400" /> Membership Plans & Subscriptions
          </h1>
          <p className="text-xs text-slate-400 mt-1">Upgrade your membership tier or manage auto-renewals & early cancellation refunds</p>
        </div>

        {/* Auto Renewal Toggle */}
        {member && (
          <div className="flex items-center gap-3 bg-dark-surface p-3 rounded-2xl border border-dark-border">
            <div className="text-xs">
              <div className="font-bold text-white">Auto-Renewal Billing</div>
              <div className="text-[10px] text-slate-400">Continuous access protection</div>
            </div>
            <button
              onClick={handleToggleAutoRenew}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                member.autoRenew ? 'bg-brand-500 justify-end' : 'bg-dark-border justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-black shadow-md" />
            </button>
          </div>
        )}
      </div>

      {/* Plans List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading available plans...</div>
        ) : (
          plans.map((p) => {
            const isCurrent = member?.membershipPlanId?._id === p._id && member?.membershipStatus === 'Active';
            return (
              <div
                key={p._id}
                className={`glass-card rounded-3xl p-6 border flex flex-col justify-between relative transition-all ${
                  isCurrent ? 'border-brand-500 bg-brand-500/5 shadow-xl shadow-brand-500/10' : 'border-dark-border'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-500 text-black text-[10px] font-extrabold uppercase">
                    Your Active Plan
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{p.description}</p>
                  <div className="text-3xl font-extrabold text-brand-400 mb-6">
                    ₹{p.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {p.durationDays} Days</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 mb-8">
                    {p.features?.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-brand-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedPlanForCheckout(p)}
                  className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all shadow-md ${
                    isCurrent
                      ? 'bg-dark-surface text-brand-400 border border-brand-500/30 hover:bg-brand-500 hover:text-black'
                      : 'bg-brand-500 hover:bg-brand-400 text-black shadow-brand-500/20'
                  }`}
                >
                  {isCurrent ? 'Renew Current Plan' : 'Subscribe / Upgrade'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Early Cancellation Prorated Refund Banner */}
      {member?.membershipStatus === 'Active' && (
        <div className="glass-card p-6 rounded-3xl border border-neon-amber/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-neon-amber" /> Need to Cancel Early?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Our automated prorated refund engine guarantees you only pay for the exact days you used.
            </p>
          </div>

          <button
            onClick={() => setShowRefundModal(true)}
            className="px-5 py-2.5 rounded-xl bg-neon-amber/15 hover:bg-neon-amber/25 text-neon-amber border border-neon-amber/30 font-bold text-xs transition-all shrink-0"
          >
            Calculate Prorated Refund
          </button>
        </div>
      )}

      {/* Razorpay / Stripe Payment Checkout Modal */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-md rounded-3xl border border-dark-border p-6 relative shadow-2xl animate-in fade-in duration-200">
            <button
              onClick={() => setSelectedPlanForCheckout(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Checkout Membership Plan</h3>
              <p className="text-xs text-slate-400">Select payment method to activate subscription</p>
            </div>

            <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border mb-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Selected Plan:</span>
                <strong className="text-white">{selectedPlanForCheckout.name}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Duration:</span>
                <span className="text-slate-200">{selectedPlanForCheckout.durationDays} Days</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dark-border text-sm font-extrabold text-white">
                <span>Total Amount:</span>
                <span className="text-brand-400">₹{selectedPlanForCheckout.price.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-2">Payment Gateway</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Razorpay')}
                    className={`py-2.5 px-3 rounded-xl font-bold border transition-all text-center ${
                      paymentMethod === 'Razorpay'
                        ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                        : 'bg-dark-surface border-dark-border text-slate-400'
                    }`}
                  >
                    Razorpay UPI / Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Stripe')}
                    className={`py-2.5 px-3 rounded-xl font-bold border transition-all text-center ${
                      paymentMethod === 'Stripe'
                        ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                        : 'bg-dark-surface border-dark-border text-slate-400'
                    }`}
                  >
                    Stripe Checkout
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
              >
                {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : `Pay ₹${selectedPlanForCheckout.price.toLocaleString()} & Activate`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Prorated Refund Calculation Modal */}
      {showRefundModal && member && (
        <ProratedRefundModal
          member={member}
          onClose={() => setShowRefundModal(false)}
          onSuccess={() => {
            setShowRefundModal(false);
            reloadUser();
          }}
        />
      )}
    </div>
  );
};

export default MemberPlans;
