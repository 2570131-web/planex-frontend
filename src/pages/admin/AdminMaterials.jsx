// src/pages/admin/AdminMaterials.jsx
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader, Modal, ConfirmDialog, SearchInput, Table } from '../../components/ui/index.jsx';

export default function AdminMaterials() {
  const [materials, setMaterials] = useState([]);
  const [courses,   setCourses]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState({ title:'', courseId:'', type:'pdf', url:'', description:'' });
  const [saving,    setSaving]    = useState(false);
  const [deleteId,  setDeleteId]  = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  const load = () => Promise.all([api.get('/api/materials'), api.get('/api/courses?active=false')])
    .then(([m, c]) => { setMaterials(m.data.materials || []); setCourses(c.data.courses || []); })
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    if (!form.title || !form.courseId || !form.url) return toast.error('Fill all required fields');
    setSaving(true);
    try { await api.post('/api/materials', form); toast.success('Uploaded!'); setModal(false); setForm({ title:'', courseId:'', type:'pdf', url:'', description:'' }); load(); }
    catch (err) { toast.error(err.message); } finally { setSaving(false); }
  };

  const doDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/api/materials/${deleteId}`); toast.success('Deleted'); setDeleteId(null); load(); }
    catch (err) { toast.error(err.message); } finally { setDeleting(false); }
  };

  const getCourse = id => courses.find(c => c.id === id)?.title || '—';
  const filtered  = materials.filter(m => m.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Study Materials" description={`${materials.length} resources`}
        action={<button onClick={() => setModal(true)} className="btn-gold btn-sm"><Plus size={15} /> Upload</button>} />
      <div className="mb-5"><SearchInput value={search} onChange={setSearch} placeholder="Search materials…" /></div>

      {filtered.length === 0 ? (
        <EmptyState icon="📂" title="No Materials Yet" description="Upload study materials for students."
          action={<button onClick={() => setModal(true)} className="btn-gold">Upload Material</button>} />
      ) : (
        <Table headers={['Title', 'Course', 'Type', 'Uploader', 'Actions']}>
          {filtered.map(m => (
            <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50">
              <td className="td">
                <div className="flex items-center gap-2">
                  <span>{m.type==='pdf'?'📄':m.type==='video'?'🎥':'🔗'}</span>
                  <a href={m.url} target="_blank" rel="noreferrer" className="text-gold-500 hover:text-gold-600 font-medium">{m.title}</a>
                </div>
              </td>
              <td className="td text-sm text-gray-500 dark:text-gray-400">{getCourse(m.courseId)}</td>
              <td className="td"><span className="badge badge-blue capitalize">{m.type}</span></td>
              <td className="td text-xs text-gray-400 dark:text-gray-500">{m.uploaderName || '—'}</td>
              <td className="td">
                <button onClick={() => setDeleteId(m.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={15} /></button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Upload Material">
        <form onSubmit={save} className="space-y-4">
          <div><label className="label">Title *</label><input name="title" value={form.title} onChange={handle} className="input" required /></div>
          <div><label className="label">Course *</label>
            <select name="courseId" value={form.courseId} onChange={handle} className="select" required>
              <option value="">Select…</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div><label className="label">Type</label>
            <select name="type" value={form.type} onChange={handle} className="select">
              <option value="pdf">PDF</option><option value="video">Video</option><option value="link">Link</option>
            </select>
          </div>
          <div><label className="label">URL *</label><input name="url" value={form.url} onChange={handle} className="input" placeholder="https://…" required /></div>
          <div><label className="label">Description</label><textarea name="description" value={form.description} onChange={handle} className="input min-h-[70px]" /></div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModal(false)} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold btn-sm">{saving ? <Spinner size={15} className="text-navy-900" /> : 'Upload'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete} title="Delete Material" message="Delete this material permanently?" loading={deleting} />
    </div>
  );
}
