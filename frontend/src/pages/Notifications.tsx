import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  CalendarCheck,
  Hammer,
  Info,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { api } from '../api/client';
import { NotificationItem } from '../types';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications(unreadOnly);
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [unreadOnly]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'CONFLICT':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'PROPOSAL':
      case 'SCHEDULE':
        return <CalendarCheck className="w-4 h-4 text-blue-600" />;
      case 'RESTORATION':
        return <Hammer className="w-4 h-4 text-purple-600" />;
      case 'APPROVAL':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              In-App Notification Center
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded uppercase">
              Event Dispatcher
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time inter-departmental alerts triggered by state machine transitions and conflict matches.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              unreadOnly
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {unreadOnly ? 'Showing Unread Only' : 'Show All'}
          </button>
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Mark All Read
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">All Caught Up</h3>
          <p className="text-xs text-slate-500 mt-1">
            No unread notifications currently pending for your account.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all space-y-2 ${
                !n.is_read
                  ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100'
                  : 'bg-slate-50/70 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 p-1.5 bg-slate-100 rounded-lg flex-shrink-0">
                    {getIconForType(n.type)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{n.title}</h3>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {new Date(n.created_at).toLocaleString('en-GB')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Mark read
                    </button>
                  )}

                  {n.related_proposal_id ? (
                    <Link
                      to="/coordination"
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center"
                    >
                      <span>Proposal</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  ) : n.related_request_id ? (
                    <Link
                      to={`/requests/${n.related_request_id}`}
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center"
                    >
                      <span>Request</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
