import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Consistent page title block with optional actions and breadcrumbs.
 */
export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  breadcrumb,
  className = '',
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`page-header ${className}`}
    >
      {breadcrumb?.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 flex-wrap">
          {breadcrumb.map((item, i) => (
            <span key={item.label} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-300 dark:text-slate-600">/</span>}
              {item.to ? (
                <Link to={item.to} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-700 dark:text-slate-200">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4 min-w-0">
          {Icon && (
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 dark:from-violet-500/25 dark:to-fuchsia-500/25 border border-violet-200/80 dark:border-violet-500/30 shadow-sm">
              <Icon className="w-6 h-6 text-violet-600 dark:text-violet-300" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">{actions}</div>}
      </div>
    </motion.header>
  );
}
