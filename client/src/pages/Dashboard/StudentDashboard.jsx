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
import StatCard from '../../components/common/StatCard';
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

function MentorCard({ mentor, matchScore, commonSkills }) {
  return (
    <Link to={`/profile/${mentor._id}`}>
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        className="flex items-center gap-4 p-4 rounded-xl transition-all group bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-slate-200 dark:ring-white/10">
          {mentor.avatar
            ? <img src={mentor.avatar} alt="" className="w-full h-full object-cover" />
            : <span className="text-slate-900 dark:text-white font-bold text-sm">{mentor.name?.[0]}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 dark:text-white text-base tracking-tight">{mentor.name}</p>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate mt-0.5">
            {mentor.currentRole}{mentor.currentCompany && ` · ${mentor.currentCompany}`}
          </p>
          {commonSkills?.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {commonSkills.slice(0, 2).map(s => (
                <span key={s} className="badge-primary px-2 py-0.5 text-[10px]">{s}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-500/30">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{matchScore}%</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Match</span>
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
    <div className="page-container">

      {/* ── Hero Header ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight drop-shadow-sm dark:drop-shadow-md">
              {getGreeting()}, <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Here's your network overview for today.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/profile/edit" className="btn-secondary">
              Edit Profile
            </Link>
            <Link to="/mentors" className="btn-primary">
              <Sparkles className="w-4 h-4" /> Find Mentors
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {[
          { icon: Users, label: 'AI Matches', value: matches.length, color: 'primary' },
          { icon: BookOpen, label: 'Sessions', value: sessions.length, color: 'green' },
          { icon: Calendar, label: 'Events', value: events.length, color: 'cyan' },
          { icon: MessageSquare, label: 'Discussions', value: posts.length, color: 'fuchsia' },
        ].map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left Column ── */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="lg:col-span-2 space-y-6">

          {/* AI Mentor Matches */}
          <motion.div variants={slideInVariants} className="card-glass p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-100 dark:bg-violet-500/20 border border-violet-200 dark:border-violet-500/30">
                  <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-300 drop-shadow-sm dark:drop-shadow-md" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight drop-shadow-sm">AI Mentor Matches</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Top recommendations</p>
                </div>
              </div>
              <Link to="/mentors" className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">
                View all →
              </Link>
            </div>

            {loading ? <SkeletonList rows={3} /> : matches.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mx-auto mb-3 border border-violet-200 dark:border-white/10 shadow-inner">
                  <Sparkles className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="font-bold text-slate-800 dark:text-white">No matches yet</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Add skills to your profile to get AI-matched</p>
                <Link to="/profile/edit" className="btn-primary mt-4 text-xs">Update Profile</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {matches.map(m => <MentorCard key={m.mentor._id} {...m} />)}
              </div>
            )}
          </motion.div>

          {/* Recent Discussions */}
          <motion.div variants={slideInVariants} className="card-glass p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-fuchsia-100 dark:bg-fuchsia-500/20 border border-fuchsia-200 dark:border-fuchsia-500/30">
                  <MessageSquare className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-300 drop-shadow-sm dark:drop-shadow-md" />
                </div>
                <h2 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight drop-shadow-sm">Recent Discussions</h2>
              </div>
              <Link to="/forum" className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 dark:hover:text-fuchsia-300 transition-colors">View all →</Link>
            </div>

            {loading ? <SkeletonList rows={4} /> : (
              <div className="space-y-2">
                {posts.map((post, i) => (
                  <Link key={post._id} to={`/forum/${post._id}`}>
                    <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all">
                      <span className="badge-violet flex-shrink-0">
                        {post.category}
                      </span>
                      <span className="text-sm text-slate-900 dark:text-white flex-1 truncate font-bold">{post.title}</span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex-shrink-0 bg-slate-100 dark:bg-black/30 px-2 py-1 rounded-md border border-slate-200 dark:border-white/10">
                        {post.replies?.length || 0} replies
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
          <motion.div variants={slideInVariants} className="card-glass p-7 border-t border-t-slate-200 dark:border-t-white/40">
            <h2 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 text-xl tracking-tight drop-shadow-sm">
              <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400 drop-shadow-sm dark:drop-shadow-md" /> Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                { to: '/jobs',   label: 'Browse Job Board',      icon: Briefcase },
                { to: '/resume', label: 'Analyze My Resume',      icon: FileText },
                { to: '/verify', label: 'Get Account Verified',   icon: CheckCircle },
                { to: '/achievements', label: 'View Achievements',icon: Trophy },
              ].map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all">
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300 flex-shrink-0" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{label}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/50 ml-auto" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div variants={slideInVariants} className="card-glass p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-300 drop-shadow-sm dark:drop-shadow-md" />
              </div>
              <h2 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight drop-shadow-sm">Upcoming Sessions</h2>
            </div>

            {loading ? <SkeletonList rows={2} /> : upcoming.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">No upcoming sessions</p>
                <Link to="/mentors" className="text-sm font-bold text-slate-900 dark:text-white hover:underline">
                  Book a session →
                </Link>
              </div>
            ) : upcoming.slice(0, 3).map(s => (
              <div key={s._id} className="border-l-2 border-emerald-500 dark:border-emerald-400 pl-4 py-2 mb-4 last:mb-0 bg-white/50 dark:bg-white/5 rounded-r-xl p-3">
                <p className="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight">{s.title}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">with {s.mentor?.name}</p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-300 mt-2">
                  {format(new Date(s.scheduledAt), 'MMM d, h:mm a')}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Events */}
          <motion.div variants={slideInVariants} className="card-glass p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/30">
                  <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-300 drop-shadow-sm dark:drop-shadow-md" />
                </div>
                <h2 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight drop-shadow-sm">Upcoming Events</h2>
              </div>
              <Link to="/events" className="text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">All →</Link>
            </div>

            {loading ? <SkeletonList rows={2} /> : events.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No upcoming events</p>
            ) : events.map(ev => (
              <Link key={ev._id} to={`/events/${ev._id}`}>
                <motion.div whileHover={{ scale: 1.02 }}
                  className="block p-4 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all mb-2 last:mb-0">
                  <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate tracking-tight">{ev.title}</p>
                  <div className="flex items-center gap-2.5 mt-2">
                    <span className="badge-primary">{ev.type}</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold">
                      {format(new Date(ev.scheduledAt), 'MMM d, yyyy')}
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
