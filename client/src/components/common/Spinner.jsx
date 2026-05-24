export default function Spinner({ full = false }) {
  if (full) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          {/* Animated logo */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <span className="text-2xl">🎓</span>
            </div>
            <div className="absolute -inset-1 rounded-2xl border-2 border-primary-500/30 animate-ping" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <p className="text-slate-400 text-sm font-medium">Loading AlumiNet…</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}
