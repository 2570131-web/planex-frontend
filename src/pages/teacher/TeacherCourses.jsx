// src/pages/teacher/TeacherCourses.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader } from '../../components/ui/index.jsx';

export default function TeacherCourses() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ api.get('/api/courses').then(r=>setCourses((r.data.courses||[]).filter(c=>c.teacherId===profile?.uid))).finally(()=>setLoading(false)); },[profile]);
  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="My Courses" description="Courses assigned to you"/>
      {courses.length===0 ? <EmptyState icon="📚" title="No Courses Assigned" description="Contact admin to assign courses."/>
      : <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{courses.map(c=>(
        <div key={c.id} className="card p-6">
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-display font-bold text-navy-900 dark:text-white mb-1">{c.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Class {c.classRange}</p>
          {c.description&&<p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-2">{c.description}</p>}
        </div>
      ))}</div>}
    </div>
  );
}
