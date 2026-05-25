import { useEffect, useState } from 'react';
import { adminApi } from '../../api/services';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import { Users, GraduationCap, Calendar, BookOpen, ShieldAlert, UserCheck, Shield, CheckCircle, LayoutDashboard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/themeStore';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [fraudLogs, setFraudLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    Promise.all([
      adminApi.getStats().then(r => setData(r.data)),
      adminApi.getUsers({ limit: 8 }).then(r => setUsers(r.data.users || [])),
      adminApi.getFraudLogs().then(r => setFraudLogs(r.data.logs || [])),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner full />;

  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const chartData = (data?.monthlySignups || []).map(m => ({
    name: monthLabels[m._id.month - 1],
    signups: m.count
  }));

  const tooltipStyle = isDark
    ? { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 13, color: '#f8fafc' }
    : { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: 13 };

  const handleToggle = async (userId, isActive) => {
    try {
      await adminApi.updateUser(userId, { isActive: !isActive });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !isActive } : u));
      toast.success('User updated');
    } catch { toast.error('Failed'); }
  };

  const handleResolveFraud = async (logId) => {
    try {
      await adminApi.resolveFraud(logId);
      setFraudLogs(prev => prev.filter(l => l._id !== logId));
      toast.success('Resolved');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="page-container max-w-7xl animate-fade-in">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview and management"
        icon={LayoutDashboard}
        actions={
          <Link to="/admin/verify" className="btn-secondary text-sm">
            <Shield className="w-4 h-4" /> Verifications
          </Link>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={data?.stats?.totalUsers || 0} color="primary" />
        <StatCard icon={UserCheck} label="Students" value={data?.stats?.students || 0} color="blue" />
        <StatCard icon={GraduationCap} label="Alumni" value={data?.stats?.alumni || 0} color="purple" />
        <StatCard icon={Calendar} label="Events" value={data?.stats?.events || 0} color="green" />
        <StatCard icon={BookOpen} label="Sessions" value={data?.stats?.sessions || 0} color="amber" />
        <StatCard icon={ShieldAlert} label="Fraud Alerts" value={data?.stats?.pendingFraud || 0} color="red" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card-glass p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Monthly Signups</h2>
          {chartData.length > 0 ? (
            <div className="w-full h-[240px] min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="signups" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">No signup data yet</p>
            </div>
          )}
        </div>

        <div className="card-glass p-6 flex flex-col min-h-[280px]">
          <div className="flex items-center justify-between gap-3 mb-4 flex-shrink-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" /> Fraud Alerts
            </h2>
            <Link to="/admin/verify" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline whitespace-nowrap">
              Queue →
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {fraudLogs.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">All clear</p>
              </div>
            ) : fraudLogs.slice(0, 5).map(log => (
              <div key={log._id} className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-rose-800 dark:text-rose-200">{log.user?.name || 'Unknown user'}</p>
                  <p className="text-xs text-rose-700 dark:text-rose-300 truncate mt-0.5">{log.reason}</p>
                  <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-0.5">Score: {log.score}</p>
                </div>
                <button type="button" onClick={() => handleResolveFraud(log._id)}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg flex-shrink-0 font-semibold">
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-glass p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Users</h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{data?.stats?.totalUsers || 0} total</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-3 min-w-[180px]">
                      <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-slate-200 dark:ring-white/10">
                        {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                          : <span className="text-violet-700 dark:text-violet-200 font-bold text-xs">{u.name?.[0]}</span>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{u.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge capitalize ${
                      u.role === 'admin' ? 'badge-danger'
                      : u.role === 'alumni' ? 'badge-violet'
                      : 'badge-primary'}`}>{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.isVerified ? 'badge-success' : 'badge-warning'}`}>
                      {u.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-right">
                    <button type="button" onClick={() => handleToggle(u._id, u.isActive)}
                      className={`text-xs px-3 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        u.isActive
                          ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-500/30'
                          : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-500/30'}`}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
