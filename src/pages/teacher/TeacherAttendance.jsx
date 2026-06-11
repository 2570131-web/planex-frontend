// src/pages/teacher/TeacherAttendance.jsx
import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';
import { Spinner, PageHeader } from '../../components/ui/index.jsx';

export default function TeacherAttendance() {
  const { profile } = useAuth();
  const [courses, setCourses]     = useState([]);
  const [students, setStudents]   = useState([]);
  const [selectedCourse, setSC]   = useState('');
  const [date, setDate]           = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords]     = useState({});
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
   api.get('/api/courses')
    .then(c => {
      setCourses((c.data.courses || []).filter(x => x.teacherId === profile?.uid));
    })
    .finally(() => setLoading(false));
  }, [profile]);

  
  useEffect(() => {
  if (!selectedCourse) return;

  setLoading(true);

  api.get(`/api/enrollments?courseId=${selectedCourse}`)
    .then(res => {
      setStudents(res.data.students || []);
    })
    .catch(err => {
      console.error("Student fetch error:", err);
      toast.error("Failed to load students");
    })
    .finally(() => setLoading(false));

  }, [selectedCourse]);

  

  useEffect(() => {
    if (!selectedCourse) return;
    // Pre-fill records with 'present'
    const enrolled = students; // ideally filter by enrollment; simplified here
    const r = {};
    enrolled.forEach(s => { r[s.id] = 'present'; });
    setRecords(r);
  }, [selectedCourse, students]);

  const setStatus = (id, status) => setRecords(r=>({...r,[id]:status}));

  const save = async () => {
    if (!selectedCourse||!date) return toast.error('Select course and date');
    setSaving(true);
    try {
      const recs = Object.entries(records).map(([sid,status])=>({
        studentId: sid,
        studentName: students.find(s=>s.id===sid)?.name || 'Unknown',
        status,
      }));
      await api.post('/api/attendance', { courseId: selectedCourse, date, records: recs });
      toast.success('Attendance saved!');
    } catch(e){ toast.error(e.message); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Mark Attendance" description="Record student attendance for your classes"
        action={<button onClick={save} disabled={saving||!selectedCourse} className="btn-gold btn-sm">{saving?<Spinner size={14} className="text-navy-900"/>:<><Save size={14}/> Save</>}</button>}/>
      <div className="card p-6 mb-5">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Course *</label>
            <select value={selectedCourse} onChange={e=>setSC(e.target.value)} className="select">
              <option value="">Select course…</option>
              {courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div><label className="label">Date *</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="input"/></div>
        </div>
      </div>
      {selectedCourse && students.length>0 && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-navy-800"><tr><th className="th">Student</th><th className="th text-center">Present</th><th className="th text-center">Absent</th><th className="th text-center">Late</th></tr></thead>
            <tbody>
              {students.map(s=>(
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50">
                  <td className="td font-medium text-navy-900 dark:text-white">{s.name}</td>
                  {['present','absent','late'].map(st=>(
                    <td key={st} className="td text-center">
                      <input type="radio" name={`att-${s.id}`} checked={records[s.id]===st} onChange={()=>setStatus(s.id,st)} className="accent-gold-400 w-4 h-4 cursor-pointer"/>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedCourse && students.length===0 && <div className="card p-10 text-center text-gray-400">No students found.</div>}
    </div>
  );
}
