// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend,
} from 'recharts';
import api from '../../utils/api.js';
import AdminTopBar from './AdminTopBar.jsx';
import { StatCard, Spinner } from '../../components/ui/index.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';

const COLORS = ['#f0c040', '#00b4d8', '#22c55e', '#8b5cf6', '#f97316', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm shadow-xl">
      <p className="text-gold-400 font-bold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white">{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const settings = useSettings();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/analytics/dashboard')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400" /></div>;

  const o = stats?.overview || {};

  // Pie data for enrollment status
  const enrollPie = [
    { name: 'Paid', value: o.paidEnrollments || 0 },
    { name: 'Pending', value: o.pendingPayments || 0 },
  ];

  return (
    <>
      <AdminTopBar/>
      <div className="max-w-6xl mx-auto space-y-7">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl text-navy-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Complete overview of {settings.coachingName}
        </p>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🎓" label="Total Students"   value={o.totalStudents    ?? 0} color="gold"   />
        <StatCard icon="👨‍🏫" label="Teachers"         value={o.totalTeachers    ?? 0} color="blue"   />
        <StatCard icon="📚" label="Courses"           value={o.totalCourses     ?? 0} color="green"  />
        <StatCard icon="📋" label="Enrollments"       value={o.totalEnrollments ?? 0} color="purple" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="✅" label="Paid Enrollments"   value={o.paidEnrollments     ?? 0} color="green"  />
        <StatCard icon="⏳" label="Pending Payments"   value={o.pendingPayments     ?? 0} color="gold"   />
        <StatCard icon="📊" label="Avg. Test Score"    value={`${o.avgTestScore ?? 0}%`}  color="blue"   />
        <StatCard icon="🏆" label="Tests Submitted"    value={o.totalTestsSubmitted ?? 0} color="purple" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart - top courses */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white mb-6">
            Top Courses by Enrollment
          </h2>
          {!stats?.topCourses?.length ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No enrollment data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.topCourses} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Students" radius={[8, 8, 0, 0]}>
                  {stats.topCourses.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart - enrollment status */}
        <div className="card p-6">
          <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white mb-6">
            Payment Status
          </h2>
          {o.totalEnrollments === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={enrollPie} cx="50%" cy="45%" outerRadius={75}
                  dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false} fontSize={11}>
                  <Cell fill="#22c55e" />
                  <Cell fill="#f0c040" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick access grid */}
      <div className="card p-6">
        <h2 className="font-display font-bold text-base text-navy-900 dark:text-white mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: '🎓', label: 'Add Student',    to: '/admin/students'     },
            { icon: '👨‍🏫', label: 'Add Teacher',    to: '/admin/teachers'     },
            { icon: '📚', label: 'Add Course',     to: '/admin/courses'      },
            { icon: '📂', label: 'Upload Material',to: '/admin/materials'    },
            { icon: '📝', label: 'Create Test',    to: '/admin/tests'        },
            { icon: '⚙️', label: 'Site Settings',  to: '/admin/settings'     },
          ].map(q => (
            <Link key={q.label} to={q.to}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-navy-800 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:-translate-y-0.5 transition-all text-center">
              <span className="text-2xl">{q.icon}</span>
              <span className="text-xs font-semibold text-navy-900 dark:text-white leading-tight">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
   </>
  );
}
