// src/pages/teacher/TeacherMaterials.jsx
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader, Modal, ConfirmDialog } from '../../components/ui/index.jsx';

export default function TeacherMaterials() {
  const { profile } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState({ title:'', courseId:'', type:'pdf', url:'', description:'' });
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [deleting, setDeleting]   = useState(false);

  const load = () => Promise.all([api.get('/api/materials'), api.get('/api/courses')])
    .then(([m,c])=>{ setMaterials(m.data.materials||[]); setCourses((c.data.courses||[]).filter(x=>x.teacherId===profile?.uid)); })
    .finally(()=>setLoading(false));

  useEffect(()=>{ load(); },[profile]);
  const handle = e => setForm(f=>({...f,[e.target.name]:e.target.value}));

  const save = async e => {
    e.preventDefault();
    if (!form.title||!form.courseId||!form.url) return toast.error('Fill all required fields');
    setSaving(true);
    try { await api.post('/api/materials', form); toast.success('Uploaded!'); setModal(false); setForm({title:'',courseId:'',type:'pdf',url:'',description:''}); load(); }
    catch(err){ toast.error(err.message); } finally { setSaving(false); }
  };

  const doDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/api/materials/${deleteId}`); toast.success('Deleted'); setDeleteId(null); load(); }
    catch(err){ toast.error(err.message); } finally { setDeleting(false); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Materials" description="Upload study resources for your courses"
        action={<button onClick={()=>setModal(true)} className="btn-gold btn-sm"><Plus size={15}/> Upload</button>}/>
      {materials.filter(m => courses.some(c => c.id === m.courseId)).length === 0 ? <EmptyState icon="📂" title="No Materials Yet" action={<button onClick={()=>setModal(true)} className="btn-gold">Upload Material</button>}/>
      : <div className="space-y-3">{materials.filter(m => courses.some(c => c.id === m.courseId)).map(m => (
        <div key={m.id} className="card p-5 flex items-center gap-4">
          <div className="text-2xl">{m.type==='pdf'?'📄':m.type==='video'?'🎥':'🔗'}</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-navy-900 dark:text-white truncate">{m.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{m.type}</div>
          </div>
          <a href={m.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-gold-500 hover:text-gold-600">Open</a>
          {m.uploadedBy === profile?.uid && (
  <button 
    onClick={()=>setDeleteId(m.id)} 
    className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
  >
    <Trash2 size={15}/>
  </button>
)}
        </div>
      ))}</div>}
      <Modal open={modal} onClose={()=>setModal(false)} title="Upload Material">
        <form onSubmit={save} className="space-y-4">
          <div><label className="label">Title *</label><input name="title" value={form.title} onChange={handle} className="input" required placeholder="e.g. Chapter 5 Notes"/></div>
          <div><label className="label">Course *</label><select name="courseId" value={form.courseId} onChange={handle} className="select" required><option value="">Select…</option>{courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
          <div><label className="label">Type</label><select name="type" value={form.type} onChange={handle} className="select"><option value="pdf">PDF</option><option value="video">Video</option><option value="link">Link</option></select></div>
          <div><label className="label">URL *</label><input name="url" value={form.url} onChange={handle} className="input" placeholder="https://…" required/></div>
          <div><label className="label">Description</label><textarea name="description" value={form.description} onChange={handle} className="input min-h-[70px]"/></div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={()=>setModal(false)} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold btn-sm">{saving?<Spinner size={14} className="text-navy-900"/>:'Upload'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={doDelete} title="Delete Material" message="Delete this material permanently?" loading={deleting}/>
    </div>
  );
}
