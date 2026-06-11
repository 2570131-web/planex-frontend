import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminTopBar() {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get('/api/messages');
        setMessages(res.data?.messages || []);
      } catch (err) {
        console.log('Message fetch failed');
      }
    };

    fetchMessages();

    // auto refresh every 3 sec
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);

  }, []);

  return (
    <div className="w-full flex justify-end items-center px-4 h-14 bg-white dark:bg-navy-900 border-b relative z-50">

      {/* 🔔 Bell */}
      <div
        className="relative cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <Bell size={20} className="text-gold-500 dark:text-gold-400" />

        {messages.filter(m => !m.read).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold-400 text-navy-900 text-[10px] px-1.5 rounded-full font-bold">
            {messages.filter(m => !m.read).length}
          </span>
        )}
      </div>

      {/* 📩 Dropdown */}
      {open && (
        <div className="absolute top-14 right-4 w-80 bg-white dark:bg-navy-800 shadow-xl rounded-xl border border-gray-200 dark:border-white/10">

          <div className="p-3 font-semibold border-b text-gold-500 dark:text-gold-400">
            Messages
          </div>

          <div className="max-h-64 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="p-3 text-sm text-gray-700 dark:text-white/70">No messages</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 cursor-pointer transition-all
                    ${!m.read 
                      ? 'bg-gold-400/10' 
                      : 'hover:bg-gold-400/10'}`}
                  onClick={async () => {
                    try {
                      // mark as read
                      await api.put(`/api/messages/${m.id}/read`);
                       

                      // update UI instantly
                      setMessages(prev =>
                        prev.map(msg =>
                          msg.id === m.id ? { ...msg, read: true } : msg
                        )
                      );

                      // navigate using ID (IMPORTANT FIX)
                      navigate(`/admin/messages/${m.id}`);

                    } catch (err) {
                      console.log("Mark as read failed");
                    }
                  }}
                >
                  <p className="text-sm font-semibold text-gold-600 dark:text-gold-400">{m.name}</p>
                  <p className="text-xs text-gray-800 dark:text-white/80 truncate">
                    {m.subject}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}