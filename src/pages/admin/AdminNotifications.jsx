// src/pages/admin/AdminNotifications.jsx
import { useState } from 'react';
import { Send, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import { PageHeader, Spinner } from '../../components/ui/index.jsx';

export default function AdminNotifications() {
  const [form,   setForm]   = useState({ title:'', message:'', targetId:'all' });
  const [saving, setSaving] = useState(false);
  const [sent,   setSent]   = useState([]);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const send = async e => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return toast.error('Title and message required');
    setSaving(true);
    try {
      await api.post('/api/notifications', form);
      toast.success('Notification sent!');
      setSent(s => [{ ...form, sentAt: new Date().toLocaleTimeString() }, ...s]);
      setForm({ title:'', message:'', targetId:'all' });
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const targetLabel = { all:'Everyone', student:'All Students', teacher:'All Teachers' };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader title="Send Notifications" description="Broadcast announcements to students and teachers" />

      <div className="card p-6">
        <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white mb-5 flex items-center gap-2">
          <Bell size={19} className="text-gold-400" /> Compose Notification
        </h2>
        <form onSubmit={send} className="space-y-4">
          <div><label className="label">Send To</label>
            <select name="targetId" value={form.targetId} onChange={handle} className="select">
              <option value="all">Everyone (Students + Teachers)</option>
              <option value="student">All Students</option>
              <option value="teacher">All Teachers</option>
            </select>
          </div>
          <div><label className="label">Title *</label><input name="title" value={form.title} onChange={handle} className="input" placeholder="e.g. Exam schedule update" required /></div>
          <div><label className="label">Message *</label><textarea name="message" value={form.message} onChange={handle} className="input min-h-[120px] resize-y" placeholder="Write your announcement…" required /></div>
          <button type="submit" disabled={saving} className="btn-gold w-full justify-center">
            {saving ? <Spinner size={17} className="text-navy-900" /> : <><Send size={15} /> Send Notification</>}
          </button>
        </form>
      </div>

      {sent.length > 0 && (
        <div className="card p-6">
          <h3 className="font-display font-bold text-base text-navy-900 dark:text-white mb-4">Sent This Session</h3>
          <div className="space-y-3">
            {sent.map((n, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 shrink-0"><Send size={14} /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-navy-900 dark:text-white">{n.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{n.message}</div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="badge badge-green text-[10px]">→ {targetLabel[n.targetId]}</span>
                    <span className="text-[10px] text-gray-400">{n.sentAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-5 bg-gold-50 dark:bg-gold-900/10 border border-gold-100 dark:border-gold-900/30">
        <h3 className="font-semibold text-sm text-navy-900 dark:text-white mb-2">📌 Tips</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li>Notifications appear in each user's Notifications tab immediately.</li>
          <li>Unread notifications show a gold border and dot.</li>
          <li>Use "All Students" for test reminders and academic updates.</li>
          <li>Use "All Teachers" for faculty meetings and upload reminders.</li>
        </ul>
      </div>
    </div>
  );
}
