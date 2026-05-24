import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Building, Sparkles, Users, Star, Zap } from 'lucide-react';

const features = [
  { icon: Sparkles, label: 'AI Mentor Matching',  desc: 'Get paired with alumni via TF-IDF cosine similarity', color: 'text-violet-300', bg: 'bg-violet-400/10' },
  { icon: Users,    label: 'Real-time Community', desc: 'Live chat, forums, study groups & events',             color: 'text-blue-300',   bg: 'bg-blue-400/10'   },
  { icon: Star,     label: 'Career Growth',        desc: 'Resume analysis, job recs & interview prep',          color: 'text-amber-300',  bg: 'bg-amber-400/10'  },
  { icon: Zap,      label: 'Groq AI Powered',      desc: 'llama-3.3-70b-versatile for instant guidance',        color: 'text-green-300',  bg: 'bg-green-400/10'  },
];

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student', department:'', graduationYear:'' });
  const [showPw, setShowPw] = useState(false);
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form);
    if (res.success) {
      toast.success('Account created! Welcome to AlumiNet 🎉');
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel (Same as Login) ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)' }}>

        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />
        <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10 blur-2xl"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />

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
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-[440px] animate-fade-in py-8">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">AlumiNet</span>
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create account</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Join thousands of students and alumni</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { r: 'student', emoji: '🎓', label: 'Student', desc: 'Currently studying' },
                { r: 'alumni',  emoji: '💼', label: 'Alumni',  desc: 'Already graduated' }
              ].map(({ r, emoji, label, desc }) => (
                <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.role === r
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}>
                  <span className="text-xl">{emoji}</span>
                  <p className={`text-sm font-bold mt-1 ${form.role === r ? 'text-primary-700' : 'text-slate-700'}`}>{label}</p>
                  <p className={`text-xs mt-0.5 ${form.role === r ? 'text-primary-600' : 'text-slate-400'}`}>{desc}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required className="input pl-10" placeholder="Your full name" value={form.name} onChange={f('name')} />
                </div>
              </div>
              
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" required className="input pl-10" placeholder="you@college.edu" value={form.email} onChange={f('email')} />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPw ? 'text' : 'password'} required minLength={6} className="input pl-10 pr-10" placeholder="Min. 6 characters" value={form.password} onChange={f('password')} />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Department</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="input pl-10" placeholder="e.g. CS" value={form.department} onChange={f('department')} />
                  </div>
                </div>
                <div>
                  <label className="label">Grad Year</label>
                  <input type="number" className="input" placeholder="2025" min="2000" max="2030" value={form.graduationYear} onChange={f('graduationYear')} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</>
                  : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
