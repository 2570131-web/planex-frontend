// src/pages/student/StudentLayout.jsx
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import { LayoutDashboard, BookOpen, FolderOpen, ClipboardList, Calendar, CreditCard, FileText, Bell } from 'lucide-react';

const NAV = [
  { label: 'Overview', items: [
    { to: '/student',           icon: <LayoutDashboard size={17}/>, label: 'Dashboard', end: true },
  ]},
  { label: 'Learning', items: [
    { to: '/student/courses',   icon: <BookOpen size={17}/>,        label: 'My Courses' },
    { to: '/student/materials', icon: <FolderOpen size={17}/>,      label: 'Materials' },
    { to: '/student/tests',     icon: <ClipboardList size={17}/>,   label: 'Tests' },
    { to: '/student/assignments',icon: <FileText size={17}/>,       label: 'Assignments' },
  ]},
  { label: 'Track', items: [
    { to: '/student/attendance',    icon: <Calendar size={17}/>,    label: 'Attendance' },
    { to: '/student/payments',      icon: <CreditCard size={17}/>,  label: 'Payments' },
    { to: '/student/notifications', icon: <Bell size={17}/>,        label: 'Notifications' },
  ]},
];

export default function StudentLayout() {
  return (
    <DashboardLayout navItems={NAV} roleLabel="Student" roleColor="gold">
      <Outlet />
    </DashboardLayout>
  );
}
