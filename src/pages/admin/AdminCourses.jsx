// src/pages/admin/AdminCourses.jsx
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader, Modal, ConfirmDialog } from '../../components/ui/index.jsx';

const EMPTY = { title:'', subject:'', classRange:'', description:'', fee:0, duration:'', teacherId:'', teacherName:'', isActive:true, thumbnail:'' };
const EMOJIS = { science:'🔬', math:'📐', mathematics:'📐', chemistry:'⚗️', physics:'⚡', biology:'🌿' };

export default function AdminCourses() {
  const [courses,  setCourses]  = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => Promise.all([
    api.get('/api/courses?active=false'),
    api.get('/api/users?role=teacher'),
  ]).then(([c, t]) => {
    setCourses(c.data.courses || []);
    setTeachers(t.data.users || []);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'teacherId') {
      const t = teachers.find(t => t.id === value);
      setForm(f => ({ ...f, teacherName: t?.name || '' }));
    }
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = c  => { setEditing(c.id); setForm({ ...EMPTY, ...c }); setModal(true); };

  const save = async e => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.classRange) return toast.error('Title, subject, and class range are required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/api/courses/${editing}`, form);
        toast.success('Course updated');
      } else {
        await api.post('/api/courses', form);
        toast.success('Course created');
      }
      setModal(false);
      load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const doDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/api/courses/${deleteId}`); toast.success('Course deleted'); setDeleteId(null); load(); }
    catch (err) { toast.error(err.message); }
    finally { setDeleting(false); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Courses" description={`${courses.length} courses`}
        action={<button onClick={openCreate} className="btn-gold btn-sm"><Plus size={15} /> New Course</button>} />

      {courses.length === 0 ? (
        <EmptyState icon="📚" title="No Courses Yet" description="Create your first course for students to enroll in."
          action={<button onClick={openCreate} className="btn-gold">Create Course</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(c => (
            <div key={c.id} className="card p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{EMOJIS[c.subject?.toLowerCase()] || '📚'}</div>
                <span className={`badge ${c.isActive ? 'badge-green' : 'badge-yellow'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <h3 className="font-display font-bold text-navy-900 dark:text-white mb-1 leading-tight">{c.title}</h3>
              <div className="flex flex-wrap gap-1 mb-1">
                {c.classRange?.split(',').map(cl => <span key={cl} className="badge badge-blue text-[10px]">Class {cl.trim()}</span>)}
              </div>
              {c.teacherName && <p className="text-xs text-blue-500 mb-1">👨‍🏫 {c.teacherName}</p>}
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 line-clamp-2 flex-1">{c.description}</p>
              {c.fee > 0 && <div className="font-display font-bold text-lg text-navy-900 dark:text-white mb-3">₹{c.fee}<span className="text-xs font-normal text-gray-400">/mo</span></div>}
              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-white/8">
                <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-navy-800 text-gray-700 dark:text-gray-300 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-navy-900 dark:hover:text-gold-400 transition-all">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => setDeleteId(c.id)} className="px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Course' : 'Create Course'} maxWidth="max-w-xl">
        <form onSubmit={save} className="space-y-4">
          <div><label className="label">Course Title *</label><input name="title" value={form.title} onChange={handle} className="input" required placeholder="e.g. Science – Class 9" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Subject *</label>
              <select name="subject" value={form.subject} onChange={handle} className="select" required>
                <option value="">Select…</option>
                <option value="Science">Science</option>
                <option value="Math">Math</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div><label className="label">Class Range * <span className="text-gray-400 normal-case font-normal text-[10px]">(comma separated)</span></label>
              <input name="classRange" value={form.classRange} onChange={handle} className="input" required placeholder="7,8,9,10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Fee (₹/month)</label><input name="fee" type="number" value={form.fee} onChange={handle} className="input" min={0} /></div>
            <div><label className="label">Duration</label><input name="duration" value={form.duration} onChange={handle} className="input" placeholder="e.g. 3 months" /></div>
          </div>
          <div><label className="label">Assign Teacher</label>
            <select name="teacherId" value={form.teacherId} onChange={handle} className="select">
              <option value="">None</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.subject || 'Teacher'})</option>)}
            </select>
          </div>
          <div><label className="label">Description</label><textarea name="description" value={form.description} onChange={handle} className="input min-h-[80px]" placeholder="Course overview…" /></div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="isActive" id="isActive" checked={form.isActive} onChange={handle} className="w-4 h-4 accent-gold-400" />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Active (visible to students)</label>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModal(false)} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold btn-sm">{saving ? <Spinner size={15} className="text-navy-900" /> : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete}
        title="Delete Course" message="Delete this course? All related enrollments and materials will also be removed." loading={deleting} />
    </div>
  );
}
