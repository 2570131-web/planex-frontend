// src/pages/admin/AdminAttendance.jsx
import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader } from '../../components/ui/index.jsx';

export default function AdminAttendance() {
  const [records,  setRecords]  = useState([]);
  const [courses,  setCourses]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    api.get('/api/courses?active=false')
      .then(r => setCourses(r.data.courses || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    api.get(`/api/attendance?courseId=${courseId}`)
      .then(r => setRecords(r.data.attendance || []))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading && !courseId) return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Attendance Records" description="View attendance for all courses" />
      <div className="card p-6">
        <label className="label">Select Course</label>
        <select value={courseId} onChange={e => setCourseId(e.target.value)} className="select max-w-sm">
          <option value="">Choose a course…</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Attendance Records" description="View and monitor student attendance" />
      <div className="card p-5 mb-5">
        <label className="label">Select Course</label>
        <select value={courseId} onChange={e => setCourseId(e.target.value)} className="select max-w-xs">
          <option value="">Choose a course…</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {!courseId ? null : loading ? (
        <div className="flex justify-center py-16"><Spinner size={28} className="text-gold-400" /></div>
      ) : records.length === 0 ? (
        <EmptyState icon="📅" title="No Attendance Records" description="No attendance has been marked for this course yet." />
      ) : (
        <div className="space-y-4">
          {records.map(r => (
            <div key={r.id} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-navy-900 dark:text-white">{r.date}</h3>
                <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="badge badge-green">{r.records?.filter(x=>x.status==='present').length} Present</span>
                  <span className="badge badge-red">{r.records?.filter(x=>x.status==='absent').length} Absent</span>
                  <span className="badge badge-yellow">{r.records?.filter(x=>x.status==='late').length} Late</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {r.records?.map((rec, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${rec.status==='present'?'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400':rec.status==='absent'?'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400':'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'}`}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{background:'currentColor'}}/>
                    <span className="truncate">{rec.studentName}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
