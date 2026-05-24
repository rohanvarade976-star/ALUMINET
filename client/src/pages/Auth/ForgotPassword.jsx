import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4 shadow-primary">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
          <p className="text-slate-500 mt-1 text-sm">We'll send a reset link to your email</p>
        </div>

        <div className="card p-8 animate-scale-in">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Check your inbox!</h3>
              <p className="text-slate-500 text-sm mb-6">
                If an account exists for <strong>{email}</strong>, you'll receive a password reset link within a few minutes.
              </p>
              <Link to="/login" className="btn-primary w-full justify-center">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="you@college.edu"
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mt-2">
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
