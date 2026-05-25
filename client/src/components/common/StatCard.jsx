export default function StatCard({ label, title, value, icon: Icon, color = 'primary', trend, subtitle }) {
  const displayLabel = label || title;
  const styles = {
    primary: { icon: 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300', border: 'border-violet-200/80 dark:border-violet-500/30' },
    indigo:  { icon: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300', border: 'border-indigo-200/80 dark:border-indigo-500/30' },
    green:   { icon: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300', border: 'border-emerald-200/80 dark:border-emerald-500/30' },
    amber:   { icon: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300', border: 'border-amber-200/80 dark:border-amber-500/30' },
    yellow:  { icon: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-300', border: 'border-yellow-200/80 dark:border-yellow-500/30' },
    red:     { icon: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300', border: 'border-rose-200/80 dark:border-rose-500/30' },
    purple:  { icon: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300', border: 'border-purple-200/80 dark:border-purple-500/30' },
    blue:    { icon: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300', border: 'border-blue-200/80 dark:border-blue-500/30' },
    cyan:    { icon: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300', border: 'border-cyan-200/80 dark:border-cyan-500/30' },
    fuchsia: { icon: 'bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-300', border: 'border-fuchsia-200/80 dark:border-fuchsia-500/30' },
  };
  const s = styles[color] || styles.primary;

  return (
    <div className={`card-glass p-5 border ${s.border} group hover:-translate-y-0.5 transition-transform duration-300`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.icon} border border-white/50 dark:border-white/10 shadow-inner`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`badge text-xs ${trend >= 0 ? 'badge-success' : 'badge-danger'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 font-semibold">{displayLabel}</p>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}
