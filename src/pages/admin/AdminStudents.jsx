// src/pages/admin/AdminStudents.jsx
import { useEffect, useState } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import {
  Spinner, EmptyState, PageHeader, Modal,
  ConfirmDialog, SearchInput, Table,
} from '../../components/ui/index.jsx';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState({ name:'', email:'', password:'', phone:'', classNum:'' });
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => api.get('/api/users?role=student')
    .then(r => setStudents(r.data.users || []))
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password min 6 characters');
    setSaving(true);
    try {
     await api.post('/api/users', {
        ...form,
        role: 'student',
        class: form.classNum
      });
      toast.success('Student added!');
      setModal(false);
      setForm({ name:'', email:'', password:'', phone:'', classNum:'' });
      load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const doDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/api/users/${deleteId}`); toast.success('Student deleted'); setDeleteId(null); load(); }
    catch (err) { toast.error(err.message); }
    finally { setDeleting(false); }
  };

  const toggle = async id => {
    try { const r = await api.patch(`/api/users/${id}/toggle`); toast.success(r.data.isActive ? 'Activated' : 'Deactivated'); load(); }
    catch (err) { toast.error(err.message); }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Students" description={`${students.length} total students`}
        action={<button onClick={() => setModal(true)} className="btn-gold btn-sm"><Plus size={15} /> Add Student</button>} />

      <div className="mb-5"><SearchInput value={search} onChange={setSearch} placeholder="Search students…" /></div>

      {filtered.length === 0 ? (
        <EmptyState icon="🎓" title="No Students Yet" description="Add your first student to get started."
          action={<button onClick={() => setModal(true)} className="btn-gold">Add Student</button>} />
      ) : (
        <Table headers={['Name', 'Email', 'Class', 'Status', 'Actions']}>
          {filtered.map(s => (
            <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors">
              <td className="td">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center text-gold-600 dark:text-gold-400 font-bold text-sm shrink-0">
                    {s.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium text-navy-900 dark:text-white">{s.name}</span>
                </div>
              </td>
              <td className="td text-gray-500 dark:text-gray-400 text-xs">{s.email}</td>
              <td className="td">{s.class || s.classNum || '—'}</td>
              <td className="td">
                <span className={`badge ${s.isActive ? 'badge-green' : 'badge-red'}`}>
                  {s.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="td">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(s.id)} title={s.isActive ? 'Deactivate' : 'Activate'}
                    className={`p-1.5 rounded-lg transition-all ${s.isActive ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
                    {s.isActive ? <ToggleRight size={19} /> : <ToggleLeft size={19} />}
                  </button>
                  <button onClick={() => setDeleteId(s.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add Student">
        <form onSubmit={save} className="space-y-4">
          <div><label className="label">Full Name *</label><input name="name" value={form.name} onChange={handle} className="input" required placeholder="Student name" /></div>
          <div><label className="label">Email *</label><input name="email" type="email" value={form.email} onChange={handle} className="input" required placeholder="student@email.com" /></div>
          <div><label className="label">Password *</label><input name="password" type="password" value={form.password} onChange={handle} className="input" required placeholder="Min. 6 characters" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Mobile</label><input name="phone" value={form.phone} onChange={handle} className="input" placeholder="+91 …" /></div>
            <div><label className="label">Class</label>
              <select name="classNum" value={form.classNum} onChange={handle} className="select">
                <option value="">Select…</option>
                {['7','8','9','10','11','12'].map(c => <option key={c}>Class {c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={() => setModal(false)} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold btn-sm">
              {saving ? <Spinner size={15} className="text-navy-900" /> : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete}
        title="Delete Student" message="Permanently delete this student? Their enrollments will also be removed." loading={deleting} />
    </div>
  );
}
