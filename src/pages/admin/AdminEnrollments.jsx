// src/pages/admin/AdminEnrollments.jsx
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader, Modal, ConfirmDialog, SearchInput, Table } from '../../components/ui/index.jsx';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents]   = useState([]);
  const [courses,  setCourses]    = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [search,   setSearch]     = useState('');
  const [modal,    setModal]      = useState(false);
  const [form,     setForm]       = useState({ studentId:'', courseId:'' });
  const [saving,   setSaving]     = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [deleting, setDeleting]   = useState(false);

  const load = () => Promise.all([
    api.get('/api/enrollments'),
    api.get('/api/users?role=student'),
    api.get('/api/courses'),
  ]).then(([e,s,c]) => { 
  console.log("ENROLLMENTS API:", e.data);

  setEnrollments(e.data.enrollments || e.data.students || []);
  setStudents(s.data.users || []); 
  setCourses(c.data.courses || []); 
})
  .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try { await api.post('/api/enrollments', form); toast.success('Student enrolled!'); setModal(false); setForm({ studentId:'', courseId:'' }); load(); }
    catch (err) { 
  console.error("ENROLL ERROR:", err.response?.data || err.message);
  toast.error(err.response?.data?.message || err.message); 
}
  };

  const doDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/api/enrollments/${deleteId}`); toast.success('Removed'); setDeleteId(null); load(); }
    catch (err) { toast.error(err.message); } finally { setDeleting(false); }
  };

 const enriched = enrollments.map(e => {
  const student = students.find(s => s.id === e.studentId);

  return {
    ...e,
    studentName: student?.name || 'Unknown',
    studentEmail: student?.email || '',
    studentClass: student?.class || student?.classNum || 'N/A'
  };
});

const filtered = enriched.filter(e =>
  e.studentName.toLowerCase().includes(search.toLowerCase()) ||
  e.courseName.toLowerCase().includes(search.toLowerCase())
);
  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Enrollments" description={`${enrollments.length} total enrollments`}
        action={<button onClick={() => setModal(true)} className="btn-gold btn-sm"><Plus size={15} /> Enroll Student</button>} />
      <div className="mb-5"><SearchInput value={search} onChange={setSearch} placeholder="Search by student or course…" /></div>

      {filtered.length === 0 ? (
        <EmptyState icon="👤" title="No Enrollments" description="Enroll students into courses."
          action={<button onClick={() => setModal(true)} className="btn-gold">Enroll Student</button>} />
      ) : (
        <Table headers={['Student','Course','Fee','Actions']}>
          {filtered.map(e => (
            <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50">
              <td className="td font-medium text-navy-900 dark:text-white">
                <div className="flex flex-col">
                  <span>{e.studentName}</span>

                  <span className="text-xs text-gray-500 dark:text-white/40">
                    Class {e.studentClass} • {e.studentEmail}
                  </span>
                </div>
              </td>
              <td className="td text-sm text-gray-500 dark:text-gray-400">{e.courseName}</td>
              <td className="td text-sm">{e.courseFee > 0 ? `₹${e.courseFee}` : 'Free'}</td>
              <td className="td"><button onClick={() => setDeleteId(e.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={15}/></button></td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Enroll Student">
        <form onSubmit={save} className="space-y-4">
          <div><label className="label">Student *</label>
            <select value={form.studentId} onChange={e=>setForm(f=>({...f,studentId:e.target.value}))} className="select" required>
              <option value="">Select student…</option>
              {students.map(s=><option key={s.id} value={s.id}>{s.name} ({s.email}) - Class {s.class || s.classNum || 'N/A'}</option>)}
            </select>
          </div>
          <div><label className="label">Course *</label>
            <select value={form.courseId} onChange={e=>setForm(f=>({...f,courseId:e.target.value}))} className="select" required>
              <option value="">Select course…</option>
              {courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModal(false)} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold btn-sm">{saving?<Spinner size={15} className="text-navy-900"/>:'Enroll'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete} title="Remove Enrollment" message="Remove this student from the course?" loading={deleting}/>
    </div>
  );
}
