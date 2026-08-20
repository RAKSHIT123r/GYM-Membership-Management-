import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBranch } from '../../context/BranchContext';
import { getNotificationsApi, markNotificationReadApi } from '../../services/api';
import { Dumbbell, Bell, LogOut, Building2, User, ChevronDown, Check, QrCode } from 'lucide-react';
import Avatar from './Avatar';
import QRModal from '../member/QRModal';

const Navbar = ({ onOpenScanModal }) => {
  const { user, logout } = useAuth();
  const { branches, selectedBranchId, setSelectedBranchId } = useBranch();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const { data } = await getNotificationsApi();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markNotificationReadApi('all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-dark-border px-4 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Dumbbell className="w-6 h-6 text-black transform -rotate-12" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-wider text-white font-sans">
              APEX<span className="text-brand-500">FIT</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              PLATFORM
            </span>
          </div>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3 lg:gap-5">
          {/* Branch Switcher (Admin / Trainer / Member) */}
          {branches.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 bg-dark-card border border-dark-border rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-brand-400" />
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="bg-transparent font-medium text-slate-200 outline-none cursor-pointer pr-1"
              >
                {branches.map((b) => (
                  <option key={b._id} value={b._id} className="bg-dark-surface text-slate-200">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Member QR Code Pass Button */}
          {user?.role === 'Member' && (
            <button
              onClick={() => setShowQRModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-brand-400 font-semibold text-xs transition-all shadow-sm"
              title="View Digital QR Check-in Pass"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden md:inline">My QR Pass</span>
            </button>
          )}

          {/* Reception Check-in Scanner Button for Admin/Trainer */}
          {(user?.role === 'Admin' || user?.role === 'Trainer') && onOpenScanModal && (
            <button
              onClick={onOpenScanModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 text-black hover:bg-brand-400 font-bold text-xs transition-all shadow-md shadow-brand-500/20"
            >
              <QrCode className="w-4 h-4" />
              <span>Verify QR Pass</span>
            </button>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-dark-card hover:bg-dark-border text-slate-300 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-rose text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-card rounded-2xl border border-dark-border shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-3">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-400" /> Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`p-2.5 rounded-xl text-xs border ${
                          n.isRead ? 'bg-dark-surface/50 border-transparent text-slate-400' : 'bg-brand-500/5 border-brand-500/20 text-slate-200 font-medium'
                        }`}
                      >
                        <div className="font-semibold text-white mb-0.5">{n.title}</div>
                        <div>{n.message}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Role Badge */}
          {user && (
            <div className="flex items-center gap-3 pl-2 border-l border-dark-border">
              <Avatar name={user.name} className="w-9 h-9 rounded-xl border border-brand-500/30" />
              <div className="hidden md:block">
                <div className="font-bold text-xs text-white leading-tight">{user.name}</div>
                <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider ${
                  user.role === 'Admin' ? 'text-neon-cyan' : user.role === 'Trainer' ? 'text-neon-amber' : 'text-brand-400'
                }`}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-neon-rose hover:bg-neon-rose/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Member QR Pass Modal */}
      {showQRModal && <QRModal onClose={() => setShowQRModal(false)} />}
    </>
  );
};

export default Navbar;
