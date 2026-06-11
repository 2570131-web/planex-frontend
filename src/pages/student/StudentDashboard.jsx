// src/pages/student/StudentDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ClipboardList, Bell, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';
import { StatCard, Spinner, ProgressBar } from '../../components/ui/index.jsx';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [data, setData] = useState({ enrollments:[], results:[], notifications:[], attendance:null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  Promise.allSettled([
    api.get('/api/enrollments/mine'),
    api.get('/api/results/mine'),
    api.get('/api/notifications'),
    api.get('/api/attendance/mine'),
  ])
  .then(([e, r, n, a]) => {

    // 🔍 DEBUG LOGS (very important)
    if (e.status === "rejected") console.error("Enrollments Error:", e.reason);
    if (r.status === "rejected") console.error("Results Error:", r.reason);
    if (n.status === "rejected") console.error("Notifications Error:", n.reason);
    if (a.status === "rejected") console.error("Attendance Error:", a.reason);

    setData({
      enrollments: e.status === "fulfilled" ? e.value.data.enrollments || [] : [],
      results:     r.status === "fulfilled" ? r.value.data.results || [] : [],
      notifications: n.status === "fulfilled" ? n.value.data.notifications || [] : [],
      attendance:  a.status === "fulfilled" ? a.value.data.summary || null : null,
    });
  })
  .catch(err => {
    console.error("Unexpected Dashboard Error:", err);
  })
  .finally(() => setLoading(false));
 }, []);

  const { enrollments, results, notifications, attendance } = data;
  const avgScore = results.length ? Math.round(results.reduce((s,r)=>s+r.percentage,0)/results.length) : 0;
  const unread   = notifications.filter(n=>!n.read).length;

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-7">
      {/* Greeting */}
      <div>
        <h1 className="font-display font-black text-2xl text-navy-900 dark:text-white">
          Good day, {profile?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {profile?.classNum && `${profile.classNum} · `}Here's your learning summary
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📚" label="Enrolled"      value={enrollments.length}         color="gold" />
        <StatCard icon="📝" label="Tests Taken"   value={results.length}             color="blue" />
        <StatCard icon="📊" label="Avg. Score"    value={`${avgScore}%`}             color="green" />
        <StatCard icon="📅" label="Attendance"    value={attendance ? `${attendance.percentage}%` : '—'} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white">My Courses</h2>
            <Link to="/student/courses" className="text-xs font-semibold text-gold-500 hover:text-gold-600 flex items-center gap-1">All <ArrowRight size={12}/></Link>
          </div>
          {enrollments.length === 0 ? (
            <div className="text-center py-8"><BookOpen size={28} className="mx-auto text-gray-300 dark:text-gray-600 mb-2"/><p className="text-gray-500 dark:text-gray-400 text-sm">No courses yet.</p><Link to="/courses" className="text-gold-500 text-xs font-semibold mt-1 inline-block">Browse →</Link></div>
          ) : (
            <div className="space-y-3">
              {enrollments.slice(0,4).map(e=>(
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-navy-800">
                  <div className="w-9 h-9 rounded-lg bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center text-lg shrink-0">📚</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-navy-900 dark:text-white truncate">{e.courseName}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${e.paymentStatus==='paid'?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {e.paymentStatus==='paid'?'Active':'Payment Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white">Recent Results</h2>
            <Link to="/student/tests" className="text-xs font-semibold text-gold-500 hover:text-gold-600 flex items-center gap-1">All <ArrowRight size={12}/></Link>
          </div>
          {results.length === 0 ? (
            <div className="text-center py-8"><ClipboardList size={28} className="mx-auto text-gray-300 dark:text-gray-600 mb-2"/><p className="text-gray-500 dark:text-gray-400 text-sm">No tests taken yet.</p><Link to="/student/tests" className="text-gold-500 text-xs font-semibold mt-1 inline-block">Take a test →</Link></div>
          ) : (
            <div className="space-y-3">
              {results.slice(0,4).map(r=>(
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-navy-800">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm shrink-0 ${r.percentage>=80?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':r.percentage>=50?'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400':'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {r.percentage}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-navy-900 dark:text-white truncate">{r.testTitle}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{r.score}/{r.totalMarks} marks · {r.passed?'✅ Passed':'❌ Failed'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attendance */}
        {attendance && (
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white mb-5 flex items-center gap-2"><Calendar size={18} className="text-gold-400"/> Attendance</h2>
            <div className="text-center mb-5">
              <div className="font-display font-black text-5xl text-gold-500">{attendance.percentage}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overall Attendance</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center"><div className="font-bold text-xl text-green-600 dark:text-green-400">{attendance.present}</div><div className="text-xs text-gray-500 dark:text-gray-400">Present</div></div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-center"><div className="font-bold text-xl text-red-500">{attendance.absent}</div><div className="text-xs text-gray-500 dark:text-gray-400">Absent</div></div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 text-center"><div className="font-bold text-xl text-yellow-500">{attendance.late}</div><div className="text-xs text-gray-500 dark:text-gray-400">Late</div></div>
            </div>
          </div>
        )}

        {/* Notifications */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white flex items-center gap-2">
              <Bell size={17} className="text-gold-400"/> Notifications
              {unread>0 && <span className="badge badge-gold text-[10px]">{unread} new</span>}
            </h2>
            <Link to="/student/notifications" className="text-xs font-semibold text-gold-500 hover:text-gold-600 flex items-center gap-1">All <ArrowRight size={12}/></Link>
          </div>
          {notifications.length===0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No notifications.</div>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0,4).map(n=>(
                <div key={n.id} className={`p-3 rounded-xl border-l-4 ${n.read?'bg-gray-50 dark:bg-navy-800 border-gray-200 dark:border-white/10':'bg-gold-50 dark:bg-gold-900/10 border-gold-400'}`}>
                  <div className="font-semibold text-sm text-navy-900 dark:text-white">{n.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{n.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
