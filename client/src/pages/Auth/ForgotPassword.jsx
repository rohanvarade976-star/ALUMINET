import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter your email');
    setLoading(true);
    setDevResetUrl('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email: email.trim() });
      setEmailSent(data.emailSent !== false);
      if (data.devResetUrl) setDevResetUrl(data.devResetUrl);
      setSent(true);
      if (data.emailSent) {
        toast.success('Reset link sent — check your inbox');
      } else {
        toast.error('Email not sent. Configure SMTP in server/.env or use the dev link below.');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl mb-4 shadow-primary">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password</h1>
          <p className="text-slate-500 dark:text-slate-300 mt-1 text-sm">We&apos;ll send a reset link to your email</p>
        </div>

        <div className="card-glass p-8 animate-scale-in">
          {sent ? (
            <div className="text-center py-2">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                emailSent ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-amber-100 dark:bg-amber-500/20'
              }`}>
                {emailSent
                  ? <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  : <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {emailSent ? 'Check your inbox!' : 'Reset link ready (email not sent)'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                {emailSent ? (
                  <>If an account exists for <strong className="text-slate-700 dark:text-slate-200">{email}</strong>, you should receive a link within a few minutes. Check spam too.</>
                ) : (
                  <>SMTP is not set up on the server. For local testing, use the link below or add Gmail settings to <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">server/.env</code>.</>
                )}
              </p>

              {devResetUrl && (
                <div className="text-left mb-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-200 mb-2">Development reset link</p>
                  <a href={devResetUrl} className="text-xs text-violet-600 dark:text-violet-400 break-all font-semibold hover:underline flex items-start gap-1">
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    {devResetUrl}
                  </a>
                </div>
              )}

              {!emailSent && !devResetUrl && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Set <strong>EMAIL_USER</strong> and <strong>EMAIL_PASS</strong> (Gmail App Password) in server/.env, then restart the server.
                </p>
              )}

              <Link to="/login" className="btn-primary w-full justify-center">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="you@college.edu"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mt-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
