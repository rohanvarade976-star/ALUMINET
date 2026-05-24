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
        className={`relative p-2 rounded-xl transition-all ${isOpen ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'}`}
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none ring-2 ring-white dark:ring-slate-900 shadow-sm animate-bounce-in">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card-hover z-50 animate-scale-in overflow-hidden origin-top-right">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Notifications</h3>
              {unread > 0 && <span className="badge-primary text-[10px] py-0.5">{unread} new</span>}
            </div>
            {unread > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 transition-colors">
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
              <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {notifications.map((n) => {
                  const conf = typeConfig[n.type] || typeConfig.system;
                  const Icon = conf.icon;
                  return (
                    <button key={n._id} onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${!n.isRead ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}>
                      <div className={`w-9 h-9 rounded-xl ${conf.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon className={`w-4 h-4 ${conf.color}`} />
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className={`text-sm ${!n.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                          {n.title}
                        </p>
                        <p className={`text-xs mt-0.5 leading-relaxed truncate ${!n.isRead ? 'text-slate-600 dark:text-slate-400 font-medium' : 'text-slate-500 dark:text-slate-500'}`}>
                          {n.message}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1.5">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2 shadow-sm" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
            <Link to="/notifications" onClick={() => setIsOpen(false)}
              className="block w-full py-2 text-center text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
