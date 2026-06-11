// src/pages/public/CoursesPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout.jsx';
import { Spinner } from '../../components/ui/index.jsx';
import api from '../../utils/api.js';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  useEffect(() => { api.get('/api/courses?active=true').then(r=>setCourses(r.data.courses||[])).finally(()=>setLoading(false)); }, []);
  const subjects = ['all', ...new Set(courses.map(c=>c.subject).filter(Boolean))];
  const filtered = filter==='all' ? courses : courses.filter(c=>c.subject===filter);
  const EMOJIS = {science:'🔬',math:'📐',mathematics:'📐',chemistry:'⚗️'};
  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-navy-950 to-navy-900 py-24 text-center">
        <p className="section-label">Programs</p>
        <h1 className="font-display font-black text-5xl text-white mb-3">Our <span className="text-grad">Courses</span></h1>
      </div>
      <section className="py-16 bg-gray-50 dark:bg-navy-950 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {subjects.length>1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {subjects.map(s=>(
                <button key={s} onClick={()=>setFilter(s)} className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all border-2 ${filter===s?'bg-navy-900 dark:bg-gold-400 text-gold-400 dark:text-navy-900 border-transparent':'border-gray-200 dark:border-white/20 text-gray-600 dark:text-white/65 hover:border-gold-400'}`}>
                  {s==='all'?'All Courses':s}
                </button>
              ))}
            </div>
          )}
          {loading ? <div className="flex justify-center py-20"><Spinner size={32} className="text-gold-400"/></div>
          : filtered.length===0 ? <div className="text-center py-20"><div className="text-5xl mb-3">📚</div><p className="text-gray-500">No courses yet. Check back soon!</p></div>
          : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(c=>(
                <div key={c.id} className="card-hover p-6 flex flex-col">
                  <div className="text-3xl mb-3">{EMOJIS[c.subject?.toLowerCase()]||'📚'}</div>
                  <h3 className="font-display font-bold text-lg text-navy-900 dark:text-white mb-1">{c.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">{c.classRange?.split(',').map(cl=><span key={cl} className="badge badge-blue text-[10px]">Class {cl.trim()}</span>)}</div>
                  {c.teacherName && <p className="text-xs text-blue-500 mb-2">👨‍🏫 {c.teacherName}</p>}
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-4 flex-1">{c.description||'Comprehensive curriculum for academic excellence.'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/8">
                    <span className="font-display font-bold text-xl text-navy-900 dark:text-white">
                      {c.fee>0?<>₹{c.fee}<span className="text-xs font-normal text-gray-400">/mo</span></>:<span className="text-green-500 text-sm font-semibold">Free</span>}
                    </span>
                    <Link to="/register" className="btn-gold btn-sm">Enroll<ArrowRight size={12}/></Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
