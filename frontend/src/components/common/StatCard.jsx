import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'brand', subtext, trend }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'cyan':
        return { bg: 'bg-neon-cyan/10', text: 'text-neon-cyan', border: 'border-neon-cyan/20' };
      case 'amber':
        return { bg: 'bg-neon-amber/10', text: 'text-neon-amber', border: 'border-neon-amber/20' };
      case 'rose':
        return { bg: 'bg-neon-rose/10', text: 'text-neon-rose', border: 'border-neon-rose/20' };
      case 'purple':
        return { bg: 'bg-neon-purple/10', text: 'text-neon-purple', border: 'border-neon-purple/20' };
      case 'brand':
      default:
        return { bg: 'bg-brand-500/10', text: 'text-brand-400', border: 'border-brand-500/20' };
    }
  };

  const style = getColorClasses();

  return (
    <div className="glass-card rounded-2xl p-5 border border-dark-border relative overflow-hidden group hover:border-brand-500/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{title}</span>
        <div className={`p-2.5 rounded-xl ${style.bg} ${style.border} border`}>
          <Icon className={`w-5 h-5 ${style.text}`} />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold text-white font-sans">{value}</h3>
        {trend && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-brand-500/10 text-brand-400' : 'bg-neon-rose/10 text-neon-rose'}`}>
            {trend}
          </span>
        )}
      </div>

      {subtext && <p className="text-[11px] text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
};

export default StatCard;
