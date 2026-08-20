import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlansApi, getBranchesApi } from '../services/api';
import { Dumbbell, ShieldCheck, Zap, Award, Calendar, QrCode, ArrowRight, Check, Users, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const [plans, setPlans] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pRes, bRes] = await Promise.all([getPlansApi(), getBranchesApi()]);
      setPlans(pRes.data);
      setBranches(bRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col justify-between">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-dark-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Dumbbell className="w-6 h-6 text-black transform -rotate-12" />
          </div>
          <span className="font-extrabold text-2xl tracking-wider text-white">
            APEX<span className="text-brand-500">FIT</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 flex items-center gap-1.5"
          >
            <span>Join Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-28 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider animate-bounce">
          <Sparkles className="w-4 h-4" /> Next-Gen Commercial Fitness Platform
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          ELEVATE YOUR ATHLETIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-emerald-300">POTENTIAL</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          State-of-the-art multi-branch gym management system with automated QR check-in, real-time class waitlists, personal trainer workout & nutrition planning, and seamless payments.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-sm transition-all transform hover:scale-105 shadow-xl shadow-brand-500/25 flex items-center gap-2"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-2xl glass-panel border border-dark-border hover:border-slate-500 text-white font-bold text-sm transition-all"
          >
            Explore Portals
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="glass-card p-6 rounded-3xl border border-dark-border hover:border-brand-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6 text-brand-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant QR Attendance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scan your digital QR pass at reception for instant entrance verification and active membership validation.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-dark-border hover:border-brand-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-neon-cyan" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Auto-Waitlist Classes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Book CrossFit, Yoga, and HIIT classes. If full, join the waitlist and get automatically promoted when spots open!
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-dark-border hover:border-brand-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-neon-amber/10 border border-neon-amber/30 flex items-center justify-center mb-4">
              <Dumbbell className="w-6 h-6 text-neon-amber" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Personalized Workouts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Certified personal trainers design custom hypertrophy routines and macro-calculated nutrition plans for you.
            </p>
          </div>
        </div>
      </section>

      {/* Membership Plans Comparison */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">Membership Plans</h2>
          <p className="text-xs text-slate-400 mt-2">Transparent pricing with prorated refund guarantees & auto-renewals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p._id}
              className={`glass-card rounded-3xl p-6 border flex flex-col justify-between relative ${
                p.accessLevel === 'VIP Premium' ? 'border-brand-500 shadow-xl shadow-brand-500/10' : 'border-dark-border'
              }`}
            >
              {p.accessLevel === 'VIP Premium' && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-500 text-black text-[10px] font-extrabold uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                <div className="text-xs text-slate-400 mb-4">{p.description}</div>
                <div className="text-3xl font-extrabold text-brand-400 mb-6">
                  ₹{p.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {p.durationDays} Days</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full py-3 rounded-xl bg-brand-500/10 hover:bg-brand-500 text-brand-400 hover:text-black font-extrabold text-xs text-center transition-all border border-brand-500/30"
              >
                Select Plan
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-panel border-t border-dark-border py-8 px-6 text-center text-xs text-slate-500">
        ApexFit Gym Membership System &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
