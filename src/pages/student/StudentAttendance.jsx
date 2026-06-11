// src/pages/student/StudentAttendance.jsx
import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import { Spinner, PageHeader } from '../../components/ui/index.jsx';

export default function StudentAttendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/api/attendance/mine').then(r=>setData(r.data)).finally(()=>setLoading(false)); }, []);
  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;
  const { summary, sessions } = data||{};
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Attendance" description="Your attendance record across all courses" />
      {!summary ? <div className="card p-10 text-center text-gray-400">No attendance records yet.</div> : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[['📊','Overall',`${summary.percentage}%`,'gold'],['✅','Present',summary.present,'green'],['❌','Absent',summary.absent,'red'],['⏰','Late',summary.late,'yellow']].map(([i,l,v,c])=>(
              <div key={l} className={`card p-5 text-center`}>
                <div className="text-2xl mb-2">{i}</div>
                <div className={`font-display font-black text-2xl ${c==='gold'?'text-gold-500':c==='green'?'text-green-500':c==='red'?'text-red-500':'text-yellow-500'}`}>{v}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-navy-800"><tr><th className="th">Date</th><th className="th">Status</th></tr></thead>
              <tbody>
                {(sessions || []).slice(0,30).map((s,i)=>(
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-navy-800/50">
                    <td className="td font-medium text-navy-900 dark:text-white">{s.date}</td>
                    <td className="td"><span className={`badge ${s.status==='present'?'badge-green':s.status==='absent'?'badge-red':'badge-yellow'}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}