import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import {
  GraduationCap, LayoutDashboard, Users, Calendar, MessageSquare,
  BookOpen, LogOut, User, Shield, FileText, Briefcase, CheckCircle,
  BookMarked, Trophy, ChevronRight, Wifi, WifiOff, Bell, Menu, X,
  Sparkles, Zap, Moon, Sun, Monitor
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useSocketStore from '../../store/socketStore';
import useThemeStore from '../../store/themeStore';
import NotificationBell from './NotificationBell';
import toast from 'react-hot-toast';

const navGroups = {
  student: [
    { label: 'Overview', items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-indigo-300' },
      { to: '/mentors',   icon: Users,           label: 'Find Mentors', color: 'text-violet-300' },
      { to: '/sessions',  icon: BookOpen,         label: 'My Sessions', color: 'text-blue-300' },
    ]},
    { label: 'Community', items: [
      { to: '/events',       icon: Calendar,      label: 'Events',       color: 'text-amber-300' },
      { to: '/forum',        icon: MessageSquare, label: 'Forum',        color: 'text-pink-300' },
      { to: '/chat',         icon: Zap,           label: 'Live Chat',    color: 'text-green-300' },
      { to: '/study-groups', icon: BookMarked,    label: 'Study Groups', color: 'text-cyan-300' },
      { to: '/jobs',         icon: Briefcase,     label: 'Job Board',    color: 'text-orange-300' },
    ]},
    { label: 'AI Tools', items: [
      { to: '/ai-jobs', icon: Sparkles, label: 'AI Job Match',     color: 'text-violet-300' },
      { to: '/resume',  icon: FileText, label: 'Resume Analyzer',  color: 'text-blue-300' },
    ]},
    { label: 'Account', items: [
      { to: '/achievements', icon: Trophy,      label: 'Achievements', color: 'text-amber-300' },
      { to: '/verify',       icon: CheckCircle, label: 'Get Verified',  color: 'text-green-300' },
    ]},
  ],
  alumni: [
    { label: 'Overview', items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard',   color: 'text-indigo-300' },
      { to: '/sessions',  icon: BookOpen,         label: 'My Sessions', color: 'text-blue-300' },
    ]},
    { label: 'Community', items: [
      { to: '/events',       icon: Calendar,      label: 'Events',       color: 'text-amber-300' },
      { to: '/forum',        icon: MessageSquare, label: 'Forum',        color: 'text-pink-300' },
      { to: '/chat',         icon: Zap,           label: 'Live Chat',    color: 'text-green-300' },
      { to: '/study-groups', icon: BookMarked,    label: 'Study Groups', color: 'text-cyan-300' },
      { to: '/jobs',         icon: Briefcase,     label: 'Post Jobs',    color: 'text-orange-300' },
    ]},
    { label: 'Account', items: [
      { to: '/achievements', icon: Trophy,      label: 'Achievements', color: 'text-amber-300' },
      { to: '/verify',       icon: CheckCircle, label: 'Get Verified',  color: 'text-green-300' },
    ]},
  ],
  admin: [
    { label: 'Management', items: [
      { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard',      color: 'text-indigo-300' },
      { to: '/admin/verify', icon: Shield,           label: 'Verifications',  color: 'text-green-300' },
      { to: '/events',       icon: Calendar,         label: 'Events',         color: 'text-amber-300' },
      { to: '/forum',        icon: MessageSquare,    label: 'Forum',          color: 'text-pink-300' },
      { to: '/jobs',         icon: Briefcase,        label: 'Jobs',           color: 'text-orange-300' },
    ]},
  ],
};

function NavItem({ to, icon: Icon, label, color }) {
  return (
    <NavLink
      to={to} end={to === '/dashboard'}
      className={({ isActive }) =>
        isActive
          ? 'sidebar-link-active group'
          : 'sidebar-link group'
      }
    >
      {({ isActive }) => (
        <>
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 ${isActive ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : color}`} />
          </span>
          <span className="flex-1 truncate">{label}</span>
          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />}
        </>
      )}
    </NavLink>
  );
}

function NavGroup({ label, items }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1.5">{label}</p>
      <div className="space-y-0.5">
        {items.map(item => <NavItem key={item.to} {...item} />)}
      </div>
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { connected } = useSocketStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const groups = navGroups[user?.role] || navGroups.student;
  const verifStatus = user?.verificationStatus || 'none';

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const Sidebar = () => (
    <aside className="w-64 flex flex-col flex-shrink-0 h-full"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-sm"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-white text-base leading-none tracking-tight">AlumiNet</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-[10px] text-slate-400 font-medium">{connected ? 'Live' : 'Offline'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell />
          </div>
        </div>
      </div>

      {/* Verification banner */}
      {verifStatus === 'none' && user?.role !== 'admin' && (
        <NavLink to="/verify"
          className="mx-3 mt-3 p-3 rounded-xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/15 transition-all flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center flex-shrink-0">
            <span className="text-amber-400 text-xs font-bold">!</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-300">Verify Account</p>
            <p className="text-[10px] text-amber-400/70 truncate">Unlock all features</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400/60 group-hover:translate-x-0.5 transition-transform" />
        </NavLink>
      )}
      {verifStatus === 'approved' && (
        <div className="mx-3 mt-3 p-2.5 rounded-xl border border-green-400/30 bg-green-400/10 flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
          <p className="text-[11px] font-bold text-green-300">Verified Account</p>
        </div>
      )}
      {verifStatus === 'pending' && (
        <div className="mx-3 mt-3 p-2.5 rounded-xl border border-blue-400/30 bg-blue-400/10 flex items-center gap-2">
          <span className="text-[11px] font-bold text-blue-300">⏳ Under Review</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-2 scrollbar-hidden">
        {groups.map(g => <NavGroup key={g.label} {...g} />)}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-violet-600
                          flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-white/20">
            {user?.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              : <span className="text-white font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 capitalize">
              {user?.role}{user?.role === 'admin' && ' 🛡️'}{user?.points > 0 && ` · ${user.points}pts`}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <NavLink to={`/profile/${user?._id}`}
            className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 hover:text-white hover:bg-white/10 py-2 rounded-xl transition-all font-medium">
            <User className="w-3.5 h-3.5" /> Profile
          </NavLink>
          <button onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 hover:text-red-400 hover:bg-red-400/10 py-2 rounded-xl transition-all font-medium">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
        <button onClick={toggleTheme} className="mt-2 w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white hover:bg-white/10 py-2 rounded-xl transition-all font-medium">
          {theme === 'light' ? <Sun className="w-3.5 h-3.5" /> : theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
          Theme: <span className="capitalize">{theme}</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 animate-slide-in">
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 z-10 btn-icon text-white hover:bg-white/10">
              <X className="w-4 h-4" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
          <button onClick={() => setMobileOpen(true)} className="btn-icon">
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">AlumiNet</span>
          </div>
          <div className="ml-auto">
            <NotificationBell />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
          <AnimatePresence mode="wait">
            <AnimatedPage key={location.pathname}>
              <Outlet />
            </AnimatedPage>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
