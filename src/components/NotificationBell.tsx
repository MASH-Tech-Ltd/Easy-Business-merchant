'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NotificationBell({ userId }: { userId?: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleSingleRead = (e: any) => {
      setNotifications(prev => prev.map(n => n._id === e.detail ? { ...n, read: true } : n));
    };
    const handleAllRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };
    window.addEventListener('notificationMarkedRead', handleSingleRead);
    window.addEventListener('notificationAllMarkedRead', handleAllRead);
    return () => {
      window.removeEventListener('notificationMarkedRead', handleSingleRead);
      window.removeEventListener('notificationAllMarkedRead', handleAllRead);
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || "");
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_user_room', userId);
    });

    newSocket.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-medium text-[#5022C3] hover:text-[#401ba0] focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 5000 });
    });

    return () => {
      newSocket.emit('leave_user_room', userId);
      newSocket.close();
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/my-notifications');
      const data = res.data?.data || {};
      setNotifications(Array.isArray(data) ? data : (data.notifications || []));
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    setIsOpen(false);
    
    if (notification.type.startsWith('TICKET') && notification.relatedEntityId) {
      router.push(`/dashboard/support/${notification.relatedEntityId}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('notificationCountUpdate', { detail: unreadCount }));
  }, [unreadCount]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center min-w-[16px] h-[16px] text-[9px] font-bold text-white bg-red-500 rounded-full border-2 border-white px-0.5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-[#5022C3] hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No notifications yet
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.slice(0, 5).map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-purple-50/30' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {notification.title}
                      </span>
                      {!notification.read && <span className="w-1.5 h-1.5 bg-[#5022C3] rounded-full mt-1.5 shrink-0"></span>}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-1">{notification.message}</p>
                    <span className="text-[10px] text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={() => { setIsOpen(false); router.push('/dashboard/notifications'); }}
              className="w-full text-center text-sm font-medium text-[#5022C3] hover:text-[#401ba0] hover:underline p-1"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
