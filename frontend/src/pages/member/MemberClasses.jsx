import React, { useState, useEffect } from 'react';
import { getClassesApi, bookClassApi, cancelBookingApi } from '../../services/api';
import { useBranch } from '../../context/BranchContext';
import { Calendar, Clock, User, CheckCircle2, Hourglass, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const MemberClasses = () => {
  const { selectedBranchId } = useBranch();
  const [classes, setClasses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadClasses();
  }, [selectedBranchId, categoryFilter]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const { data } = await getClassesApi({ branchId: selectedBranchId, category: categoryFilter || undefined });
      setClasses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClass = async (classId) => {
    try {
      const { data } = await bookClassApi(classId);
      if (data.type === 'Booking') {
        confetti({ particleCount: 80, spread: 60 });
      }
      setMessage({ type: 'success', text: data.message });
      setTimeout(() => setMessage(null), 4000);
      loadClasses();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleCancelBooking = async (classId) => {
    try {
      const { data } = await cancelBookingApi(classId);
      setMessage({ type: 'success', text: data.message + (data.promotedMember ? ` (${data.promotedMember})` : '') });
      setTimeout(() => setMessage(null), 4000);
      loadClasses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-dark-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-neon-cyan" /> Class Booking & Automatic Waitlists
          </h1>
          <p className="text-xs text-slate-400 mt-1">Reserve seats in group fitness sessions or queue on waitlists for full classes</p>
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="glass-input rounded-xl px-4 py-2 text-xs text-white bg-dark-surface outline-none"
        >
          <option value="">All Categories</option>
          <option value="CrossFit">CrossFit</option>
          <option value="Yoga">Yoga</option>
          <option value="Zumba">Zumba</option>
          <option value="Strength Training">Strength Training</option>
          <option value="HIIT">HIIT</option>
          <option value="Boxing">Boxing</option>
        </select>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between animate-in fade-in ${
            message.type === 'success' ? 'bg-brand-500/15 border-brand-500/30 text-brand-400' : 'bg-neon-rose/15 border-neon-rose/30 text-neon-rose'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Class Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading class schedule...</div>
        ) : classes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">No classes scheduled in this branch</div>
        ) : (
          classes.map((c) => {
            const isBooked = c.userStatus === 'Booked';
            const isWaitlisted = c.userStatus?.startsWith('Waitlisted');
            const isFull = c.bookedSeats >= c.capacity;

            return (
              <div
                key={c._id}
                className={`glass-card rounded-3xl p-6 border flex flex-col justify-between space-y-4 transition-all ${
                  isBooked ? 'border-brand-500 bg-brand-500/5' : isWaitlisted ? 'border-neon-amber/40' : 'border-dark-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan uppercase">
                      {c.category}
                    </span>
                    <span className={`text-xs font-extrabold ${isFull ? 'text-neon-rose' : 'text-brand-400'}`}>
                      {c.bookedSeats} / {c.capacity} Seats {isFull && '(FULL)'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{c.name}</h3>
                  <p className="text-xs text-slate-400">{c.description || 'High intensity fitness training'}</p>
                </div>

                <div className="bg-dark-surface p-3.5 rounded-2xl border border-dark-border text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-400" /> {c.startTime} - {c.endTime}</span>
                    <span className="text-slate-400">{c.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-dark-border/50">
                    <span className="text-slate-400">Coach:</span>
                    <strong className="text-white">{c.trainerId?.userId?.name || 'Trainer'}</strong>
                  </div>
                </div>

                <div>
                  {isBooked ? (
                    <div className="space-y-2">
                      <div className="text-center text-xs text-brand-400 font-extrabold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Reserved Seat
                      </div>
                      <button
                        onClick={() => handleCancelBooking(c._id)}
                        className="w-full py-2 rounded-xl bg-dark-surface hover:bg-neon-rose/20 text-slate-400 hover:text-neon-rose text-xs font-semibold border border-dark-border"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  ) : isWaitlisted ? (
                    <div className="space-y-2">
                      <div className="text-center text-xs text-neon-amber font-extrabold flex items-center justify-center gap-1.5">
                        <Hourglass className="w-4 h-4" /> {c.userStatus}
                      </div>
                      <button
                        onClick={() => handleCancelBooking(c._id)}
                        className="w-full py-2 rounded-xl bg-dark-surface hover:bg-neon-rose/20 text-slate-400 hover:text-neon-rose text-xs font-semibold border border-dark-border"
                      >
                        Leave Waitlist
                      </button>
                    </div>
                  ) : isFull ? (
                    <button
                      onClick={() => handleBookClass(c._id)}
                      className="w-full py-3 rounded-xl bg-neon-amber hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/20"
                    >
                      Join Waitlist
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookClass(c._id)}
                      className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-md shadow-brand-500/20"
                    >
                      Book Class Now
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MemberClasses;
