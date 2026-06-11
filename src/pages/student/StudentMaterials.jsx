// src/pages/student/StudentMaterials.jsx
import { useEffect, useState } from 'react';
import { FileText, Video, ExternalLink, Download } from 'lucide-react';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader, SearchInput } from '../../components/ui/index.jsx';

export default function StudentMaterials() {
  const [materials, setMaterials]   = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    Promise.all([api.get('/api/materials'), api.get('/api/enrollments/mine')])
      .then(([m,e])=>{ setMaterials(m.data.materials||[]); setEnrollments(e.data.enrollments||[]); })
      .finally(()=>setLoading(false));
  }, []);

  const enrolledIds = new Set(enrollments.map(e=>e.courseId));
  const accessible  = materials.filter(m=>enrolledIds.has(m.courseId));
  const filtered    = accessible.filter(m=>
    (filter==='all'||m.type===filter) && m.title?.toLowerCase().includes(search.toLowerCase())
  );

  const typeIcon = t => t==='pdf'?<FileText size={20}/>:t==='video'?<Video size={20}/>:<ExternalLink size={20}/>;
  const typeColor = t => t==='pdf'?'bg-red-50 dark:bg-red-900/20 text-red-500':t==='video'?'bg-blue-50 dark:bg-blue-900/20 text-blue-500':'bg-gold-50 dark:bg-gold-900/20 text-gold-500';

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Study Materials" description="PDFs, videos, and resources from your courses" />
      <div className="flex flex-wrap gap-3 mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Search materials…" />
        <div className="flex gap-1.5">
          {['all','pdf','video','link'].map(t=>(
            <button key={t} onClick={()=>setFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter===t?'bg-navy-900 dark:bg-gold-400 text-white dark:text-navy-900':'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-navy-700'}`}>{t}</button>
          ))}
        </div>
      </div>
      {enrollments.length===0 ? (
        <EmptyState icon="📂" title="No Enrolled Courses" description="Enroll in a course to access materials." />
      ) : filtered.length===0 ? (
        <EmptyState icon="🔍" title="No Materials Found" description="No materials match your search yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(m=>(
            <div key={m.id} className="card p-5 flex items-start gap-4 hover:-translate-y-0.5 transition-all">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${typeColor(m.type)}`}>{typeIcon(m.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-navy-900 dark:text-white truncate">{m.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">{m.type}</div>
                {m.description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">{m.description}</p>}
                <a href={m.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-bold text-gold-500 hover:text-gold-600">
                  {m.type==='pdf'?<><Download size={12}/>Download PDF</>:m.type==='video'?<><Video size={12}/>Watch Video</>:<><ExternalLink size={12}/>Open Link</>}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
