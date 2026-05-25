/**
 * Aligned tab row for admin / filter UIs.
 */
export default function TabBar({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`tab-group ${className}`} role="tablist">
      {tabs.map(({ key, label, icon: Icon, count }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          onClick={() => onChange(key)}
          className={active === key ? 'tab-btn tab-btn-active' : 'tab-btn tab-btn-inactive'}
        >
          {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
          <span>{label}</span>
          {count != null && (
            <span className={`ml-1 min-w-[1.25rem] px-1.5 py-0.5 rounded-md text-[10px] font-bold leading-none ${
              active === key ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
            }`}>
              {count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
