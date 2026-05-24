/**
 * Skeleton loader components for smooth loading states
 * Usage: <SkeletonCard />, <SkeletonList rows={5} />, <SkeletonText lines={3} />
 */

export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-3 w-4/6 rounded" />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 animate-pulse">
          <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 rounded" style={{ width: `${60 + (i % 3) * 15}%` }} />
            <div className="skeleton h-3 rounded w-1/3" />
          </div>
          <div className="skeleton h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="stat-card animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton w-9 h-9 rounded-xl" />
      </div>
      <div className="skeleton h-8 w-16 rounded mb-1" />
      <div className="skeleton h-3 w-20 rounded" />
    </div>
  );
}

export function SkeletonGrid({ cols = 3, rows = 2 }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-4`}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
