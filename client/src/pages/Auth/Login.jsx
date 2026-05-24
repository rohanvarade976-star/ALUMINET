import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Users, Star, Zap } from 'lucide-react';

const features = [
  { icon: Sparkles, label: 'AI Mentor Matching',  desc: 'Get paired with alumni via TF-IDF cosine similarity', color: 'text-violet-300', bg: 'bg-violet-400/10' },
  { icon: Users,    label: 'Real-time Community', desc: 'Live chat, forums, study groups & events',             color: 'text-blue-300',   bg: 'bg-blue-400/10'   },
  { icon: Star,     label: 'Career Growth',        desc: 'Resume analysis, job recs & interview prep',          color: 'text-amber-300',  bg: 'bg-amber-400/10'  },
  { icon: Zap,      label: 'Groq AI Powered',      desc: 'llama-3.3-70b-versatile for instant guidance',        color: 'text-green-300',  bg: 'bg-green-400/10'  },
];

const demoRoles = [
  { label: '🎓 Student', email: 'student@demo.com', gradient: 'from-blue-500 to-indigo-600' },
  { label: '👨‍💼 Alumni',  email: 'alumni@demo.com',  gradient: 'from-violet-500 to-purple-600' },
  { label: '🛡️ Admin',    email: 'admin@demo.com',   gradient: 'from-slate-500 to-slate-700' },
];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    const res = await login(form.email, form.password);
    setLoggingIn(false);
    if (res.success) {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)' }}>

        {/* Decorative orbs */}
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />
        <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10 blur-2xl"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-glow-sm"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">AlumiNet</span>
          </div>

          {/* Hero text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 text-xs font-semibold text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI-Powered · Free · Open Platform
            </div>
            <h2 className="text-5xl font-bold text-white leading-tight mb-4">
              Connect.<br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Learn.</span><br />
              Grow.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              AlumiNet bridges students and alumni through AI-powered mentorship, real-time community, and career tools.
            </p>

            {/* Feature list */}
            <div className="mt-10 grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, label, desc, color, bg }) => (
                <div key={label} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{label}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-[400px] animate-fade-in">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">AlumiNet</span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Sign in to your AlumiNet account</p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" required className="input pl-10" placeholder="you@example.com"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-semibold">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPw ? 'text' : 'password'} required className="input pl-10 pr-10"
                    placeholder="Enter your password" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loggingIn} className="btn-primary w-full py-3 text-sm mt-1">
                {loggingIn
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                  : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                Create account
              </Link>
            </p>
          </div>

          {/* Demo access */}
          <div className="mt-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Demo</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {demoRoles.map(({ label, email, gradient }) => (
                <button key={label}
                  onClick={() => setForm({ email, password: 'demo123' })}
                  className={`text-xs py-2.5 px-2 rounded-xl font-semibold text-white
                              bg-gradient-to-br ${gradient} hover:opacity-90 active:scale-95
                              transition-all shadow-sm`}>
                  {label}
                </button>
              ))}
            </div>
            <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">Password: demo123 · Click role then Sign In</p>
          </div>
        </div>
      </div>
    </div>
  );
}
