import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Lock, Mail, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Member',
    fitnessGoal: 'General Fitness & Conditioning'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await register(formData);
      if (data.role === 'Admin') navigate('/admin');
      else if (data.role === 'Trainer') navigate('/trainer');
      else navigate('/member');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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
          <h2 className="text-2xl font-extrabold text-white">Create ApexFit Account</h2>
          <p className="text-xs text-slate-400">Join the ultimate fitness management platform</p>
        </div>

        <form onSubmit={handleRegister} className="glass-panel p-6 rounded-3xl border border-dark-border space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-neon-rose/10 border border-neon-rose/30 text-neon-rose text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Morgan"
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Role Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none bg-dark-surface"
            >
              <option value="Member">Gym Member</option>
              <option value="Trainer">Personal Trainer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-brand-400 font-bold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
