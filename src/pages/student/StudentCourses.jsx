// src/pages/student/StudentCourses.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader } from '../../components/ui/index.jsx';

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/api/enrollments/mine').then(r=>setEnrollments(r.data.enrollments||[])).finally(()=>setLoading(false)); }, []);
  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="My Courses" description="Your enrolled programs" />
      {enrollments.length === 0 ? (
        <EmptyState icon="📚" title="No Courses Yet" description="Browse and enroll in available courses."
          action={<Link to="/courses" className="btn-gold">Browse Courses</Link>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {enrollments.map(e=>(
            <div key={e.id} className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center text-2xl shrink-0">📚</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-navy-900 dark:text-white truncate">{e.courseName}</h3>
                  <span className={`badge text-[10px] mt-1 ${e.paymentStatus==='paid'?'badge-green':'badge-yellow'}`}>
                    {e.paymentStatus==='paid'?'✓ Active':'⏳ Payment Pending'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/student/materials" className="btn-gold btn-sm flex-1 justify-center">Materials</Link>
                <Link to="/student/tests"     className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm flex-1 justify-center">Tests</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
