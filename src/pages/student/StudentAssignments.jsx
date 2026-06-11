// src/pages/student/StudentAssignments.jsx
import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader, Modal } from '../../components/ui/index.jsx';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState({ submissionUrl:'', note:'' });
  const [saving, setSaving]     = useState(false);

  useEffect(() => { api.get('/api/assignments').then(r=>setAssignments(r.data.assignments||[])).finally(()=>setLoading(false)); },[]);

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/api/assignments/${modal.id}/submit`, form);
      toast.success('Assignment submitted!');
      setModal(null);
    } catch(err){ toast.error(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Assignments" description="Assignments from your courses" />
      {assignments.length===0
        ? <EmptyState icon="📝" title="No Assignments Yet" description="Assignments will appear here when assigned by your teacher." />
        : (
          <div className="space-y-4">
            {assignments.map(a=>(
              <div key={a.id} className="card p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-xl shrink-0">📋</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-navy-900 dark:text-white">{a.title}</h3>
                  {a.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">{a.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                    {a.dueDate && <span>📅 Due: {a.dueDate}</span>}
                    <span>Max marks: {a.maxMarks}</span>
                  </div>
                </div>
                <button onClick={()=>setModal(a)} className="btn-gold btn-sm shrink-0"><Send size={12}/> Submit</button>
              </div>
            ))}
          </div>
        )
      }
      <Modal open={!!modal} onClose={()=>setModal(null)} title={`Submit: ${modal?.title}`}>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Submission URL *</label><input value={form.submissionUrl} onChange={e=>setForm(f=>({...f,submissionUrl:e.target.value}))} className="input" placeholder="https://…" required/></div>
          <div><label className="label">Note (optional)</label><textarea value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} className="input min-h-[80px]" placeholder="Any comments…"/></div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={()=>setModal(null)} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold btn-sm">{saving?<Spinner size={14} className="text-navy-900"/>:'Submit'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
