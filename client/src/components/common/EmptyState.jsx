import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className = '',
}) {
  const Action = actionTo ? Link : 'button';
  const actionProps = actionTo
    ? { to: actionTo, className: 'btn-primary mt-5 text-sm' }
    : { type: 'button', onClick: onAction, className: 'btn-primary mt-5 text-sm' };

  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-500/20 dark:to-fuchsia-500/20 border border-violet-200/80 dark:border-violet-500/30 shadow-inner">
          <Icon className="w-8 h-8 text-violet-600 dark:text-violet-300" />
        </div>
      )}
      <p className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">{title}</p>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm leading-relaxed">{description}</p>
      )}
      {(actionLabel && (actionTo || onAction)) && (
        <Action {...actionProps}>{actionLabel}</Action>
      )}
    </div>
  );
}
