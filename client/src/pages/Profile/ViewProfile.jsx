import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userApi, mentorApi } from '../../api/services';
import useAuthStore from '../../store/authStore';
import Spinner from '../../components/common/Spinner';
import { MapPin, Briefcase, GraduationCap, Edit, Github, Linkedin, CalendarDays, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function ViewProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    userApi.getProfile(id).then(r => setProfile(r.data.user)).finally(() => setLoading(false));
  }, [id]);

  const handleQuickBook = async () => {
    const scheduledAt = new Date(Date.now() + 24*60*60*1000).toISOString();
    setBooking(true);
    try {
      await mentorApi.bookSession({ mentorId: id, title: 'Quick mentorship session', scheduledAt, duration: 60 });
      toast.success('Session request sent!');
    } catch (err) { toast.error(err.response?.data?.error || 'Booking failed'); }
    finally { setBooking(false); }
  };

  if (loading) return <Spinner full />;
  if (!profile) return <div className="page-container text-center text-slate-500">User not found.</div>;

  const isOwnProfile = currentUser?._id === id;

  // Generate radar data based on skills or defaults
  const radarData = profile.skills?.length >= 3 
    ? profile.skills.slice(0, 6).map(s => ({ subject: s, A: 60 + (s.length * 5) % 40, fullMark: 100 }))
    : [
        { subject: 'Communication', A: 85, fullMark: 100 },
        { subject: 'Leadership', A: 75, fullMark: 100 },
        { subject: 'Problem Solving', A: 90, fullMark: 100 },
        { subject: 'Technical', A: 80, fullMark: 100 },
        { subject: 'Teamwork', A: 95, fullMark: 100 },
      ];

  return (
    <div className="page-container animate-fade-in max-w-5xl">
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* ── Left Column: Main Profile Info ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            {/* Banner */}
            <div className="h-36 relative" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
              <div className="absolute inset-0 bg-dot-pattern opacity-20" />
            </div>
            
            <div className="px-6 pb-6 relative z-10">
              {/* Avatar & Actions */}
              <div className="flex items-end justify-between -mt-12 mb-5">
                <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-800 bg-gradient-to-br from-primary-100 to-violet-100 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-primary-500/10">
                  {profile.avatar
                    ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                    : <span className="text-primary-700 font-bold text-3xl">{profile.name?.[0]}</span>}
                </div>
                <div className="flex gap-2 pb-2">
                  {isOwnProfile && (
                    <Link to="/profile/edit" className="btn-secondary text-xs px-4 py-2">
                      <Edit className="w-3.5 h-3.5" /> Edit Profile
                    </Link>
                  )}
                  {!isOwnProfile && profile.role === 'alumni' && currentUser?.role === 'student' && (
                    <button onClick={handleQuickBook} disabled={booking} className="btn-primary text-xs px-4 py-2 shadow-primary">
                      {booking ? 'Requesting…' : 'Book Session'}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{profile.name}</h1>
                  <span className={`badge capitalize text-[11px] py-0.5 ${
                    profile.role === 'alumni' ? 'badge-success'
                    : profile.role === 'admin' ? 'badge-danger'
                    : 'badge-primary'}`}>
                    {profile.role}
                  </span>
                  {profile.isVerified && (
                    <span className="badge bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[11px] py-0.5 ring-1 ring-primary-200">✓ Verified</span>
                  )}
                </div>

                <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {(profile.currentRole || profile.currentCompany) && (
                    <p className="flex items-center gap-2 font-medium">
                      <Briefcase className="w-4 h-4 text-primary-500" />
                      {profile.currentRole}{profile.currentCompany && ` @ ${profile.currentCompany}`}
                    </p>
                  )}
                  {profile.department && (
                    <p className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-violet-500" />
                      {profile.department}{profile.graduationYear && ` · Class of ${profile.graduationYear}`}
                    </p>
                  )}
                  {profile.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" /> {profile.location}
                    </p>
                  )}
                </div>

                {profile.bio && (
                  <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Socials & Basic Info */}
          <div className="grid grid-cols-2 gap-4">
             {profile.linkedIn && (
              <a href={profile.linkedIn} target="_blank" rel="noreferrer" className="card-hover p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">LinkedIn</p>
                  <p className="text-xs text-slate-500">View profile</p>
                </div>
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="card-hover p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Github className="w-5 h-5 text-slate-700 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">GitHub</p>
                  <p className="text-xs text-slate-500">View projects</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* ── Right Column: Stats & Charts ── */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Points Card */}
          <div className="card-glass relative overflow-hidden p-6 text-center"
               style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1))' }}>
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm ring-4 ring-primary-500/20">
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{profile.points || 0}</h3>
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mt-1">Total Points</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Active community member</p>
          </div>

          {/* Radar Chart */}
          <div className="card p-5">
            <h2 className="font-bold text-slate-800 dark:text-white mb-2">Skill Overview</h2>
            <div className="h-[250px] w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#cbd5e1" strokeOpacity={0.4} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Radar name="Proficiency" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tags */}
          {profile.skills?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-bold text-slate-800 dark:text-white mb-3">Core Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="badge-primary text-xs">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {profile.interests?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-bold text-slate-800 dark:text-white mb-3">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map(interest => (
                  <span key={interest} className="badge-gray text-xs">{interest}</span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
