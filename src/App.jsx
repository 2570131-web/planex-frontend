// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Public
import HomePage    from './pages/public/HomePage.jsx';
import AboutPage   from './pages/public/AboutPage.jsx';
import CoursesPage from './pages/public/CoursesPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import ResultsPage from './pages/public/ResultsPage.jsx';

// Auth
import LoginPage    from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

// Student
import StudentLayout       from './pages/student/StudentLayout.jsx';
import StudentDashboard    from './pages/student/StudentDashboard.jsx';
import StudentCourses      from './pages/student/StudentCourses.jsx';
import StudentMaterials    from './pages/student/StudentMaterials.jsx';
import StudentTests        from './pages/student/StudentTests.jsx';
import TakeTest            from './pages/student/TakeTest.jsx';
import StudentAttendance   from './pages/student/StudentAttendance.jsx';
import StudentPayments     from './pages/student/StudentPayments.jsx';
import StudentAssignments  from './pages/student/StudentAssignments.jsx';
import StudentNotifications from './pages/student/StudentNotifications.jsx';

// Teacher
import TeacherLayout       from './pages/teacher/TeacherLayout.jsx';
import TeacherDashboard    from './pages/teacher/TeacherDashboard.jsx';
import TeacherCourses      from './pages/teacher/TeacherCourses.jsx';
import TeacherMaterials    from './pages/teacher/TeacherMaterials.jsx';
import TeacherTests        from './pages/teacher/TeacherTests.jsx';
import TeacherAttendance   from './pages/teacher/TeacherAttendance.jsx';
import TeacherAssignments  from './pages/teacher/TeacherAssignments.jsx';
import TeacherNotifications from './pages/teacher/TeacherNotifications.jsx';

// Admin
import AdminLayout        from './pages/admin/AdminLayout.jsx';
import AdminDashboard     from './pages/admin/AdminDashboard.jsx';
import AdminStudents      from './pages/admin/AdminStudents.jsx';
import AdminTeachers      from './pages/admin/AdminTeachers.jsx';
import AdminCourses       from './pages/admin/AdminCourses.jsx';
import AdminMaterials     from './pages/admin/AdminMaterials.jsx';
import AdminTests         from './pages/admin/AdminTests.jsx';
import AdminEnrollments   from './pages/admin/AdminEnrollments.jsx';
import AdminPayments      from './pages/admin/AdminPayments.jsx';
import AdminAttendance    from './pages/admin/AdminAttendance.jsx';
import AdminNotifications from './pages/admin/AdminNotifications.jsx';
import AdminSettings      from './pages/admin/AdminSettings.jsx';
import AdminMessages      from './pages/admin/AdminMessages.jsx';

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center font-display font-black text-2xl text-navy-900 mb-4 animate-pulse">
          PA
        </div>
        <p className="text-white/40 text-sm animate-pulse">Loading…</p>
      </div>
    </div>
  );
}

function Guard({ allow, children }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (allow && profile && !allow.includes(profile.role))
    return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<HomePage />} />
      <Route path="/about"    element={<AboutPage />} />
      <Route path="/courses"  element={<CoursesPage />} />
      <Route path="/contact"  element={<ContactPage />} />
      <Route path="/results"  element={<ResultsPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student */}
      <Route path="/student" element={<Guard allow={['student']}><StudentLayout /></Guard>}>
        <Route index                   element={<StudentDashboard />} />
        <Route path="courses"          element={<StudentCourses />} />
        <Route path="materials"        element={<StudentMaterials />} />
        <Route path="tests"            element={<StudentTests />} />
        <Route path="tests/:id"        element={<TakeTest />} />
        <Route path="attendance"       element={<StudentAttendance />} />
        <Route path="payments"         element={<StudentPayments />} />
        <Route path="assignments"      element={<StudentAssignments />} />
        <Route path="notifications"    element={<StudentNotifications />} />
      </Route>

      {/* Teacher */}
      <Route path="/teacher" element={<Guard allow={['teacher']}><TeacherLayout /></Guard>}>
        <Route index                   element={<TeacherDashboard />} />
        <Route path="courses"          element={<TeacherCourses />} />
        <Route path="materials"        element={<TeacherMaterials />} />
        <Route path="tests"            element={<TeacherTests />} />
        <Route path="attendance"       element={<TeacherAttendance />} /> 
        <Route path="assignments"      element={<TeacherAssignments />} />
        <Route path="/teacher/notifications" element={<TeacherNotifications />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<Guard allow={['admin']}><AdminLayout /></Guard>}>
        <Route index                   element={<AdminDashboard />} />
        <Route path="students"         element={<AdminStudents />} />
        <Route path="teachers"         element={<AdminTeachers />} />
        <Route path="courses"          element={<AdminCourses />} />
        <Route path="materials"        element={<AdminMaterials />} />
        <Route path="tests"            element={<AdminTests />} />
        <Route path="enrollments"      element={<AdminEnrollments />} />
        <Route path="payments"         element={<AdminPayments />} />
        <Route path="attendance"       element={<AdminAttendance />} />
        <Route path="notifications"    element={<AdminNotifications />} />
        <Route path="settings"         element={<AdminSettings />} />
        <Route path="messages/:id"     element={<AdminMessages />} />
        
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
