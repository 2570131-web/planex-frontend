import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader } from '../../components/ui/index.jsx';

export default function TeacherNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/notifications?role=teacher')   // ✅ IMPORTANT FILTER
      .then(r => setNotifications(r.data.notifications || []))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await api.patch(`/api/notifications/${id}/read`).catch(()=>{});
    setNotifications(ns =>
      ns.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const unread = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={32} className="text-gold-400"/>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Teacher Notifications"
        description={`${unread} unread`}
        action={
          unread > 0 && (
            <button
              onClick={() =>
                notifications
                  .filter(n => !n.read)
                  .forEach(n => markRead(n.id))
              }
              className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm"
            >
              Mark all read
            </button>
          )
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No Notifications"
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              className={`card p-5 cursor-pointer border-l-4 transition-all hover:shadow-md ${
                n.read
                  ? 'border-transparent'
                  : 'border-gold-400 bg-gold-50/50 dark:bg-gold-900/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    n.read
                      ? 'bg-gray-100 dark:bg-navy-800 text-gray-400'
                      : 'bg-gold-100 dark:bg-gold-900/20 text-gold-500'
                  }`}
                >
                  <Bell size={16}/>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-semibold ${
                      n.read
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-navy-900 dark:text-white'
                    }`}>
                      {n.title}
                    </h3>

                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0 mt-1"/>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}