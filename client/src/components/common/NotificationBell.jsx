import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, MessageSquare, Calendar, Star, Info, Check } from 'lucide-react';
import { notificationApi } from '../../api/services';
import useSocketStore from '../../store/socketStore';
import { formatDistanceToNow } from 'date-fns';

const typeConfig = {
  message: { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  session: { icon: Calendar, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  system: { icon: Info, color: 'text-primary-500', bg: 'bg-primary-100 dark:bg-primary-900/30' },
  achievement: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' }
};

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocketStore();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchUnreadCount = () => {
    notificationApi.getAll({ limit: 1 }).then(r => setUnread(r.data.unreadCount || 0)).catch(() => {});
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const r = await notificationApi.getAll({ limit: 5 });
      setNotifications(r.data.notifications || []);
      setUnread(r.data.unreadCount || 0);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (newNotif) => {
      setUnread(prev => prev + 1);
      if (isOpen) {
        setNotifications(prev => [newNotif, ...prev].slice(0, 5));
      }
    };
    socket.on('new_notification', handler);
    return () => socket.off('new_notification', handler);
  }, [socket, isOpen]);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationApi.markAllRead();
      setUnread(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const handleNotificationClick = async (notif) => {
    setIsOpen(false);
    if (!notif.isRead) {
      await notificationApi.markRead(notif._id);
      setUnread(prev => Math.max(0, prev - 1));
    }
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all ${isOpen ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-inner' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}`}
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-fuchsia-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-[0_0_10px_rgba(217,70,239,0.8)] animate-bounce-in ring-2 ring-slate-100 dark:ring-slate-900/50">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:-right-4 mt-4 lg:right-auto lg:left-full lg:top-0 lg:mt-0 lg:ml-6 w-[320px] sm:w-[380px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-2xl border border-slate-200 dark:border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] animate-scale-in overflow-hidden lg:origin-top-left origin-top-right">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-100/50 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Notifications</h3>
              {unread > 0 && <span className="badge-primary text-[10px] py-0.5">{unread} new</span>}
            </div>
            {unread > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 dark:hover:text-fuchsia-300 flex items-center gap-1 transition-colors">
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-400">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-3 border border-slate-100 dark:border-slate-700">
                  <CheckCircle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="font-semibold text-slate-600 dark:text-slate-300 text-sm">All caught up!</p>
                <p className="text-xs text-slate-400 mt-1">Check back later for new updates.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {notifications.map((n) => {
                  const conf = typeConfig[n.type] || typeConfig.system;
                  const Icon = conf.icon;
                  return (
                    <button key={n._id} onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors ${!n.isRead ? 'bg-fuchsia-50 dark:bg-fuchsia-500/10' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl ${conf.bg} flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-white/10 mt-0.5`}>
                        <Icon className={`w-5 h-5 ${conf.color}`} />
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className={`text-sm ${!n.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                          {n.title}
                        </p>
                        <p className={`text-xs mt-1 leading-relaxed truncate ${!n.isRead ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                          {n.message}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wide">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.isRead && <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 flex-shrink-0 mt-2 shadow-[0_0_8px_rgba(217,70,239,0.8)]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
            <Link to="/notifications" onClick={() => setIsOpen(false)}
              className="block w-full py-2.5 text-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-slate-300 dark:hover:border-white/20">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
