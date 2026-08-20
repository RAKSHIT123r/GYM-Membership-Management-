import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  Calendar,
  Dumbbell,
  Apple,
  TrendingUp,
  Lock,
  Building,
  QrCode,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const getNavLinks = () => {
    switch (user.role) {
      case 'Admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/admin/members', label: 'Members', icon: Users },
          { to: '/admin/trainers', label: 'Trainers', icon: UserCheck },
          { to: '/admin/plans', label: 'Membership Plans', icon: Sparkles },
          { to: '/admin/classes', label: 'Class Management', icon: Calendar },
          { to: '/admin/lockers', label: 'Lockers', icon: Lock },
          { to: '/admin/branches', label: 'Gym Branches', icon: Building },
          { to: '/admin/payments', label: 'Payments & Refunds', icon: CreditCard },
          { to: '/admin/attendance', label: 'Attendance Logs', icon: QrCode },
        ];
      case 'Trainer':
        return [
          { to: '/trainer', label: 'Trainer Dashboard', icon: LayoutDashboard },
          { to: '/trainer/members', label: 'Assigned Members', icon: Users },
          { to: '/trainer/schedule', label: 'Class Schedule', icon: Calendar },
          { to: '/trainer/workouts', label: 'Workout Builder', icon: Dumbbell },
          { to: '/trainer/nutrition', label: 'Nutrition Builder', icon: Apple },
          { to: '/trainer/progress', label: 'Member Progress', icon: TrendingUp },
        ];
      case 'Member':
      default:
        return [
          { to: '/member', label: 'My Dashboard', icon: LayoutDashboard },
          { to: '/member/plans', label: 'Plans & Renewals', icon: Sparkles },
          { to: '/member/classes', label: 'Book Classes', icon: Calendar },
          { to: '/member/workout', label: 'My Workout Plan', icon: Dumbbell },
          { to: '/member/nutrition', label: 'My Nutrition Plan', icon: Apple },
          { to: '/member/progress', label: 'Fitness Progress', icon: TrendingUp },
          { to: '/member/lockers', label: 'My Locker', icon: Lock },
          { to: '/member/payments', label: 'Billing & Invoices', icon: CreditCard },
        ];
    }
  };

  const links = getNavLinks();

  return (
    <aside className="w-full lg:w-64 glass-panel border-r border-dark-border p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Role Badge Indicator */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Portal Access</div>
            <div className="text-sm font-extrabold text-white">{user.role} Control</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin' || link.to === '/trainer' || link.to === '/member'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500 text-black shadow-lg shadow-brand-500/20 font-bold scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-dark-card'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding */}
      <div className="pt-4 border-t border-dark-border/50 text-[11px] text-slate-500 text-center">
        ApexFit Management v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
