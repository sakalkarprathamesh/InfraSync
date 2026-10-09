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
        return <AlertTriangle className="w-4 h-4 text-[#EA4335]" />;
      case 'PROPOSAL':
      case 'SCHEDULE':
        return <CalendarCheck className="w-4 h-4 text-[#1A73E8]" />;
      case 'RESTORATION':
        return <Hammer className="w-4 h-4 text-[#FBBC04]" />;
      case 'APPROVAL':
        return <ShieldCheck className="w-4 h-4 text-[#34A853]" />;
      default:
        return <Info className="w-4 h-4 text-[#5F6368]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DADCE0]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-[#202124] tracking-tight">
              In-App Notification Center
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#E8F0FE] text-[#1A73E8] rounded-full uppercase">
              Event Dispatcher
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            Real-time inter-departmental alerts triggered by state machine transitions and conflict matches.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-4 py-2 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
              unreadOnly
                ? 'bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]'
                : 'bg-white border-[#DADCE0] text-[#202124] hover:bg-[#F8F9FA]'
            }`}
          >
            {unreadOnly ? 'Showing Unread Only' : 'Show All'}
          </button>
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-[#202124] bg-white border border-[#DADCE0] rounded-2xl hover:bg-[#F8F9FA] transition-colors shadow-xs cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-[#34A853]" />
            Mark All Read
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DADCE0] shadow-xs">
          <Bell className="w-10 h-10 text-[#5F6368] mx-auto mb-2" />
          <h3 className="text-base font-black text-[#202124]">All Caught Up</h3>
          <p className="text-xs text-[#5F6368] mt-1">
            No unread notifications currently pending for your account.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-2 ${
                !n.is_read
                  ? 'bg-white border-[#DADCE0] shadow-xs hover:border-[#1A73E8]'
                  : 'bg-[#F8F9FA] border-[#DADCE0]/80 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 p-2 bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl flex-shrink-0">
                    {getIconForType(n.type)}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#202124]">{n.title}</h3>
                    <p className="text-xs text-[#5F6368] mt-0.5 leading-relaxed font-medium">{n.message}</p>
                    <span className="text-[10px] text-[#5F6368] mt-1.5 block">
                      {new Date(n.created_at).toLocaleString('en-GB')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-[11px] font-bold text-[#1A73E8] hover:underline cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}

                  {n.related_proposal_id ? (
                    <Link
                      to="/coordination"
                      className="px-3 py-1.5 text-[11px] font-bold text-[#202124] bg-white border border-[#DADCE0] hover:bg-[#F8F9FA] rounded-2xl flex items-center shadow-2xs"
                    >
                      <span>Proposal</span>
                      <ArrowRight className="w-3 h-3 ml-1 text-[#1A73E8]" />
                    </Link>
                  ) : n.related_request_id ? (
                    <Link
                      to={`/requests/${n.related_request_id}`}
                      className="px-3 py-1.5 text-[11px] font-bold text-[#202124] bg-white border border-[#DADCE0] hover:bg-[#F8F9FA] rounded-2xl flex items-center shadow-2xs"
                    >
                      <span>Request</span>
                      <ArrowRight className="w-3 h-3 ml-1 text-[#1A73E8]" />
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
