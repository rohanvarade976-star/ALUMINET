import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mentorApi, eventApi, forumApi } from '../../api/services';
import useAuthStore from '../../store/authStore';
import { motion } from 'framer-motion';
import {
  Users, Calendar, MessageSquare, BookOpen, ArrowRight,
  Star, Sparkles, Clock, TrendingUp, Briefcase, FileText,
  CheckCircle, Zap, Trophy
} from 'lucide-react';
import { SkeletonCard, SkeletonList } from '../../components/common/Skeleton';
import { format } from 'date-fns';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function StatCard({ icon: Icon, label, value, gradient, lightBg, textColor }) {
  return (
    <motion.div variants={itemVariants} className={`relative overflow-hidden rounded-2xl p-5 ${lightBg} dark:bg-slate-800 border border-white/60 dark:border-slate-700 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[15px] font-bold text-slate-600 dark:text-slate-300">{label}</p>
          <p className={`text-4xl font-black mt-1 ${textColor} dark:text-white`}>{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 bg-gradient-to-br ${gradient}`} />
    </motion.div>
  );
}

function MentorCard({ mentor, matchScore, commonSkills }) {
  return (
    <Link to={`/profile/${mentor._id}`}>
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3.5 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-sm bg-white dark:bg-slate-800">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-100 to-violet-100 flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-slate-800 shadow-sm">
          {mentor.avatar
            ? <img src={mentor.avatar} alt="" className="w-full h-full object-cover" />
            : <span className="text-primary-700 font-bold text-sm">{mentor.name?.[0]}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 dark:text-white text-base">{mentor.name}</p>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate mt-0.5">
            {mentor.currentRole}{mentor.currentCompany && ` · ${mentor.currentCompany}`}
          </p>
          {commonSkills?.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {commonSkills.slice(0, 2).map(s => (
                <span key={s} className="badge-primary text-[10px] px-2 py-0.5">{s}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
          <div className="flex items-center gap-1 bg-gradient-to-r from-green-50 to-emerald-50 px-2.5 py-1.5 rounded-full border border-green-200">
            <Star className="w-3 h-3 text-green-600 fill-green-600" />
            <span className="text-xs font-bold text-green-700">{matchScore}%</span>
          </div>
          <span className="text-[10px] text-slate-400">match</span>
        </div>
      </motion.div>
    </Link>
  );
}

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState([]);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      mentorApi.getMatches().then(r => setMatches(r.data.matches?.slice(0, 3) || [])).catch(() => {}),
      eventApi.getAll({ limit: 3 }).then(r => setEvents(r.data.events || [])).catch(() => {}),
      forumApi.getPosts({ limit: 4 }).then(r => setPosts(r.data.posts || [])).catch(() => {}),
      mentorApi.getSessions().then(r => setSessions(r.data.sessions || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const upcoming = sessions.filter(s => s.status === 'confirmed' && new Date(s.scheduledAt) > new Date());

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ── Hero Header ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl mb-7 p-6"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-40px] left-[200px] w-[200px] h-[200px] rounded-full opacity-10 blur-2xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-3 text-[11px] font-semibold text-white/70">
              <Sparkles className="w-3 h-3 text-violet-400" />
              AI-Powered Dashboard
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {getGreeting()}, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-400 text-sm">Here's what's happening in your network today.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/profile/edit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all text-sm font-semibold text-white">
              Edit Profile
            </Link>
            <Link to="/mentors"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-primary-lg hover:shadow-glow transition-shadow"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <Sparkles className="w-3.5 h-3.5" /> Find Mentors
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard icon={Users}         label="AI Matches"   value={matches.length}  gradient="from-primary-500 to-violet-600"  lightBg="bg-gradient-to-br from-primary-50 to-violet-50"  textColor="text-primary-700" />
        <StatCard icon={BookOpen}      label="Sessions"     value={sessions.length} gradient="from-green-500 to-emerald-600"   lightBg="bg-gradient-to-br from-green-50 to-emerald-50"   textColor="text-green-700" />
        <StatCard icon={Calendar}      label="Events"       value={events.length}   gradient="from-blue-500 to-cyan-600"       lightBg="bg-gradient-to-br from-blue-50 to-cyan-50"       textColor="text-blue-700" />
        <StatCard icon={MessageSquare} label="Discussions"  value={posts.length}    gradient="from-violet-500 to-purple-600"   lightBg="bg-gradient-to-br from-violet-50 to-purple-50"   textColor="text-violet-700" />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── Left Column ── */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="lg:col-span-2 space-y-5">

          {/* AI Mentor Matches */}
          <motion.div variants={slideInVariants} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary-500 to-violet-600 shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-base">AI Mentor Matches</h2>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Powered by TF-IDF cosine similarity</p>
                </div>
              </div>
              <Link to="/mentors" className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? <SkeletonList rows={3} /> : matches.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-violet-50 flex items-center justify-center mx-auto mb-3 border border-primary-100">
                  <Sparkles className="w-7 h-7 text-primary-400" />
                </div>
                <p className="font-bold text-slate-700">No matches yet</p>
                <p className="text-slate-400 text-sm mt-1">Add skills to your profile to get AI-matched</p>
                <Link to="/profile/edit" className="btn-primary mt-4 text-xs">Update Profile</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {matches.map(m => <MentorCard key={m.mentor._id} {...m} />)}
              </div>
            )}
          </motion.div>

          {/* Recent Discussions */}
          <motion.div variants={slideInVariants} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base">Recent Discussions</h2>
              </div>
              <Link to="/forum" className="text-sm font-bold text-primary-600 hover:text-primary-700">View all →</Link>
            </div>

            {loading ? <SkeletonList rows={4} /> : (
              <div className="space-y-1.5">
                {posts.map((post, i) => (
                  <Link key={post._id} to={`/forum/${post._id}`}>
                    <motion.div whileHover={{ scale: 1.01, x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-sm bg-white dark:bg-slate-800`}>
                      <span className={`badge flex-shrink-0 ${
                        post.category === 'career' ? 'badge-primary'
                        : post.category === 'technical' ? 'badge-violet'
                        : 'badge-gray'}`}>
                        {post.category}
                      </span>
                      <span className="text-sm text-slate-800 dark:text-slate-100 flex-1 truncate font-bold">{post.title}</span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex-shrink-0 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full ring-1 ring-slate-200 dark:ring-slate-700">
                        {post.replies?.length || 0}
                      </span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* ── Right Column ── */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">

          {/* Quick Actions */}
          <motion.div variants={slideInVariants} className="relative overflow-hidden rounded-2xl p-5"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
            <div className="absolute inset-0 bg-dot-pattern opacity-20" />
            <div className="relative z-10">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  { to: '/jobs',   label: 'Browse Job Board',      icon: Briefcase,   color: 'from-amber-400/20 to-orange-400/20', border: 'border-amber-400/30', text: 'text-amber-300' },
                  { to: '/resume', label: 'Analyze My Resume',      icon: FileText,    color: 'from-blue-400/20 to-cyan-400/20',    border: 'border-blue-400/30',  text: 'text-blue-300' },
                  { to: '/verify', label: 'Get Account Verified',   icon: CheckCircle, color: 'from-green-400/20 to-emerald-400/20',border: 'border-green-400/30', text: 'text-green-300' },
                  { to: '/achievements', label: 'View Achievements',icon: Trophy,      color: 'from-violet-400/20 to-purple-400/20',border: 'border-violet-400/30',text: 'text-violet-300' },
                ].map(({ to, label, icon: Icon, color, border, text }) => (
                  <Link key={to} to={to}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${border} bg-gradient-to-r ${color} hover:opacity-90 transition-all`}>
                      <Icon className={`w-4 h-4 ${text} flex-shrink-0`} />
                      <span className={`text-sm font-semibold ${text}`}>{label}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${text} ml-auto opacity-60`} />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div variants={slideInVariants} className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Upcoming Sessions</h2>
            </div>

            {loading ? <SkeletonList rows={2} /> : upcoming.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-sm text-slate-400 mb-2">No upcoming sessions</p>
                <Link to="/mentors" className="text-xs font-bold text-primary-600 hover:underline">
                  Book a session →
                </Link>
              </div>
            ) : upcoming.slice(0, 3).map(s => (
              <motion.div whileHover={{ x: 5 }} key={s._id} className="border-l-2 border-primary-500 pl-3 py-2 mb-3 last:mb-0 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl">
                <p className="text-[15px] font-bold text-slate-900 dark:text-white">{s.title}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">with {s.mentor?.name}</p>
                <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mt-1.5">
                  📅 {format(new Date(s.scheduledAt), 'MMM d, h:mm a')}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Events */}
          <motion.div variants={slideInVariants} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base">Upcoming Events</h2>
              </div>
              <Link to="/events" className="text-sm font-bold text-primary-600">All →</Link>
            </div>

            {loading ? <SkeletonList rows={2} /> : events.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No upcoming events</p>
            ) : events.map(ev => (
              <Link key={ev._id} to={`/events/${ev._id}`}>
                <motion.div whileHover={{ scale: 1.02 }}
                  className="block p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all mb-2 last:mb-0 hover:shadow-sm bg-white dark:bg-slate-800">
                  <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate">{ev.title}</p>
                  <div className="flex items-center gap-2.5 mt-2">
                    <span className="badge-gray capitalize text-[11px] font-bold">{ev.type}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      📅 {format(new Date(ev.scheduledAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
