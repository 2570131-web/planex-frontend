// src/pages/teacher/TeacherDashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';
import { StatCard, Spinner } from '../../components/ui/index.jsx';

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const [courses, setCourses]     = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tests, setTests]         = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([api.get('/api/courses'), api.get('/api/materials'), api.get('/api/tests')])
      .then(([c,m,t]) => {
        setCourses((c.data.courses||[]).filter(c=>c.teacherId===profile?.uid));
        setMaterials((m.data.materials||[]).filter(m=>m.uploadedBy===profile?.uid));
        setTests((t.data.tests||[]).filter(t=>t.createdBy===profile?.uid));
      }).finally(()=>setLoading(false));
  }, [profile]);

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;
  return (
    <div className="max-w-4xl mx-auto space-y-7">
      <div><h1 className="font-display font-black text-2xl text-navy-900 dark:text-white">Welcome, {profile?.name?.split(' ')[0]} 👋</h1><p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{profile?.subject||'Teacher'} · Planex Academy</p></div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="📚" label="My Courses"    value={courses.length}   color="gold"/>
        <StatCard icon="📂" label="Materials"      value={materials.length} color="blue"/>
        <StatCard icon="📝" label="Tests Created"  value={tests.length}     color="green"/>
      </div>
      <div className="card p-6">
        <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white mb-4">Assigned Courses</h2>
        {courses.length===0 ? <p className="text-gray-500 dark:text-gray-400 text-sm">No courses assigned yet.</p>
        : <div className="space-y-3">{courses.map(c=>(
          <div key={c.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-navy-800 rounded-xl">
            <div className="text-2xl">📚</div>
            <div><div className="font-semibold text-sm text-navy-900 dark:text-white">{c.title}</div><div className="text-xs text-gray-500 dark:text-gray-400">Class {c.classRange}</div></div>
          </div>
        ))}</div>}
      </div>
    </div>
  );
}
