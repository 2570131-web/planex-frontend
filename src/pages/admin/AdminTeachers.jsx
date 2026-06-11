// src/pages/admin/AdminTeachers.jsx
import { useEffect, useState } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader, Modal, ConfirmDialog, SearchInput, Table } from '../../components/ui/index.jsx';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState({ name:'', email:'', password:'', phone:'', subject:'' });
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => api.get('/api/users?role=teacher')
    .then(r => setTeachers(r.data.users || []))
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password min 6 chars');
    setSaving(true);
    try {
      await api.post('/api/users', { ...form, role: 'teacher' });
      toast.success('Teacher added!');
      setModal(false);
      setForm({ name:'', email:'', password:'', phone:'', subject:'' });
      load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const doDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/api/users/${deleteId}`); toast.success('Teacher deleted'); setDeleteId(null); load(); }
    catch (err) { toast.error(err.message); }
    finally { setDeleting(false); }
  };

  const toggle = async id => {
    try { const r = await api.patch(`/api/users/${id}/toggle`); toast.success(r.data.isActive ? 'Activated' : 'Deactivated'); load(); }
    catch (err) { toast.error(err.message); }
  };

  const filtered = teachers.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Teachers" description={`${teachers.length} teachers`}
        action={<button onClick={() => setModal(true)} className="btn-gold btn-sm"><Plus size={15} /> Add Teacher</button>} />

      <div className="mb-5"><SearchInput value={search} onChange={setSearch} placeholder="Search teachers…" /></div>

      {filtered.length === 0 ? (
        <EmptyState icon="👨‍🏫" title="No Teachers Yet" description="Add your first teacher."
          action={<button onClick={() => setModal(true)} className="btn-gold">Add Teacher</button>} />
      ) : (
        <Table headers={['Name', 'Email', 'Subject', 'Status', 'Actions']}>
          {filtered.map(t => (
            <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50">
              <td className="td">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm shrink-0">
                    {t.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium text-navy-900 dark:text-white">{t.name}</span>
                </div>
              </td>
              <td className="td text-gray-500 dark:text-gray-400 text-xs">{t.email}</td>
              <td className="td">{t.subject || '—'}</td>
              <td className="td"><span className={`badge ${t.isActive ? 'badge-green' : 'badge-red'}`}>{t.isActive ? 'Active' : 'Inactive'}</span></td>
              <td className="td">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(t.id)} className={`p-1.5 rounded-lg ${t.isActive ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
                    {t.isActive ? <ToggleRight size={19} /> : <ToggleLeft size={19} />}
                  </button>
                  <button onClick={() => setDeleteId(t.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add Teacher">
        <form onSubmit={save} className="space-y-4">
          <div><label className="label">Full Name *</label><input name="name" value={form.name} onChange={handle} className="input" required /></div>
          <div><label className="label">Email *</label><input name="email" type="email" value={form.email} onChange={handle} className="input" required /></div>
          <div><label className="label">Password *</label><input name="password" type="password" value={form.password} onChange={handle} className="input" required placeholder="Min. 6 chars" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Mobile</label><input name="phone" value={form.phone} onChange={handle} className="input" placeholder="+91 …" /></div>
            <div><label className="label">Subject</label><input name="subject" value={form.subject} onChange={handle} className="input" placeholder="e.g. Science" /></div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModal(false)} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold btn-sm">{saving ? <Spinner size={15} className="text-navy-900" /> : 'Add Teacher'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete}
        title="Delete Teacher" message="Delete this teacher account permanently?" loading={deleting} />
    </div>
  );
}
