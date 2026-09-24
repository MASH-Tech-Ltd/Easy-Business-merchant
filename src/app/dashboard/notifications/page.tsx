'use client';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { Bell, Check, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const fetchNotifications = async (pageNumber: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/notifications/my-notifications?limit=20&page=${pageNumber}`);
      const data = res.data?.data || {};
      const newNotifications = Array.isArray(data) ? data : (data.notifications || []);
      
      if (pageNumber === 1) {
        setNotifications(newNotifications);
      } else {
        setNotifications(prev => [...prev, ...newNotifications]);
      }
      
      if (newNotifications.length < 20) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load notifications', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      window.dispatchEvent(new CustomEvent('notificationMarkedRead', { detail: id }));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      window.dispatchEvent(new CustomEvent('notificationAllMarkedRead'));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    
    if (notification.type.startsWith('TICKET') && notification.relatedEntityId) {
      router.push(`/dashboard/support/${notification.relatedEntityId}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Actions Bar Inside Card */}
        {unreadCount > 0 && (
          <div className="p-4 border-b border-gray-100 flex justify-end bg-gray-50/30">
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 text-sm font-medium text-[#5022C3] hover:text-[#401ba0] hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-purple-100 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark all as read
            </button>
          </div>
        )}

        {/* Content Section */}
        {loading && page === 1 ? (
          <div className="p-12 flex justify-center items-center flex-col gap-4">
            <div className="w-8 h-8 border-4 border-gray-100 border-t-[#5022C3] rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm animate-pulse">Loading your notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 flex justify-center items-center flex-col text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">You're all caught up!</h3>
            <p className="text-gray-500 max-w-sm">
              When you get orders, support tickets, or system alerts, they'll show up right here.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-purple-50/10' : ''
                  }`}
                >
                  <div className="shrink-0 mt-1">
                    {!notification.read ? (
                      <div className="w-2.5 h-2.5 bg-[#5022C3] rounded-full shadow-[0_0_8px_rgba(80,34,195,0.4)]"></div>
                    ) : (
                      <div className="w-2.5 h-2.5 bg-transparent border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-2">
                      <h4 className={`text-base ${!notification.read ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                        {notification.title}
                      </h4>
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(notification.createdAt).toLocaleString(undefined, { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className={`text-sm ${!notification.read ? 'text-gray-600' : 'text-gray-500'}`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5022C3] disabled:opacity-50 transition-all"
                >
                  {loading ? 'Loading...' : 'Load Older Notifications'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
