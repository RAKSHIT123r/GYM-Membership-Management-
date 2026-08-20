import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordApi } from '../services/api';
import { Dumbbell, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await forgotPasswordApi(email);
      setResetInfo(data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center mx-auto shadow-xl shadow-brand-500/20">
            <Dumbbell className="w-8 h-8 text-black transform -rotate-12" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
          <p className="text-xs text-slate-400">Enter your registered email to receive reset instructions</p>
        </div>

        {submitted ? (
          <div className="glass-panel p-6 rounded-3xl border border-brand-500/30 text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-brand-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Reset Instructions Sent</h3>
            <p className="text-xs text-slate-300">
              We have generated a password reset request for <strong className="text-brand-400">{email}</strong>.
            </p>
            {resetInfo?.resetUrl && (
              <div className="bg-dark-surface p-3 rounded-xl border border-dark-border text-[11px] text-slate-400 font-mono break-all">
                Simulated Link: {resetInfo.resetUrl}
              </div>
            )}
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-500 text-black font-extrabold text-xs"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-dark-border space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
