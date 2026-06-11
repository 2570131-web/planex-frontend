// src/pages/teacher/TeacherAssignments.jsx
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader, Modal, ConfirmDialog } from '../../components/ui/index.jsx';

export default function TeacherAssignments() {
  const { profile } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState({ title:'', courseId:'', description:'', dueDate:'', maxMarks:100 });
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => Promise.all([api.get('/api/assignments'), api.get('/api/courses')])
    .then(([a,c])=>{ setAssignments((a.data.assignments||[]).filter(x=>x.createdBy===profile?.uid)); setCourses((c.data.courses||[]).filter(x=>x.teacherId===profile?.uid)); })
    .finally(()=>setLoading(false));

  useEffect(()=>{ load(); },[profile]);
  const handle = e => setForm(f=>({...f,[e.target.name]:e.target.value}));

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try { await api.post('/api/assignments', form); toast.success('Assignment created!'); setModal(false); setForm({title:'',courseId:'',description:'',dueDate:'',maxMarks:100}); load(); }
    catch(err){ toast.error(err.message); } finally { setSaving(false); }
  };

  const doDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/api/assignments/${deleteId}`); toast.success('Deleted'); setDeleteId(null); load(); }
    catch(err){ toast.error(err.message); } finally { setDeleting(false); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Assignments" description="Create and manage assignments"
        action={<button onClick={()=>setModal(true)} className="btn-gold btn-sm"><Plus size={15}/> Create</button>}/>
      {assignments.length===0 ? <EmptyState icon="📋" title="No Assignments Yet" action={<button onClick={()=>setModal(true)} className="btn-gold">Create Assignment</button>}/>
      : <div className="space-y-3">{assignments.map(a=>(
        <div key={a.id} className="card p-5 flex items-center gap-4">
          <div className="text-2xl">📋</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-navy-900 dark:text-white">{a.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{a.dueDate&&`Due: ${a.dueDate} · `}Max: {a.maxMarks} marks</div>
          </div>
          <button onClick={()=>setDeleteId(a.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={15}/></button>
        </div>
      ))}</div>}
      <Modal open={modal} onClose={()=>setModal(false)} title="Create Assignment">
        <form onSubmit={save} className="space-y-4">
          <div><label className="label">Title *</label><input name="title" value={form.title} onChange={handle} className="input" required/></div>
          <div><label className="label">Course *</label><select name="courseId" value={form.courseId} onChange={handle} className="select" required><option value="">Select…</option>{courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Due Date</label><input name="dueDate" type="date" value={form.dueDate} onChange={handle} className="input"/></div>
            <div><label className="label">Max Marks</label><input name="maxMarks" type="number" value={form.maxMarks} onChange={handle} className="input" min={1}/></div>
          </div>
          <div><label className="label">Description</label><textarea name="description" value={form.description} onChange={handle} className="input min-h-[80px]"/></div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={()=>setModal(false)} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold btn-sm">{saving?<Spinner size={14} className="text-navy-900"/>:'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={doDelete} title="Delete Assignment" message="Delete this assignment?" loading={deleting}/>
    </div>
  );
}
