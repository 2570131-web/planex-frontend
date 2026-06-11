// src/pages/teacher/TeacherLayout.jsx
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import { LayoutDashboard, BookOpen, FolderOpen, ClipboardList, Calendar, FileText } from 'lucide-react';

const NAV = [
  { label: 'Overview', items: [{ to:'/teacher', icon:<LayoutDashboard size={17}/>, label:'Dashboard', end:true }]},
  { label: 'Teaching', items: [
    { to:'/teacher/courses',     icon:<BookOpen size={17}/>,      label:'My Courses' },
    { to:'/teacher/materials',   icon:<FolderOpen size={17}/>,    label:'Materials' },
    { to:'/teacher/tests',       icon:<ClipboardList size={17}/>, label:'Tests' },
    { to:'/teacher/assignments', icon:<FileText size={17}/>,      label:'Assignments' },
    { to:'/teacher/attendance',  icon:<Calendar size={17}/>,      label:'Attendance' },
    { to:'/teacher/notifications', icon:<FileText size={17}/>, label:'Notifications' },
  ]},
];

export default function TeacherLayout() {
  return <DashboardLayout navItems={NAV} roleLabel="Teacher" roleColor="blue"><Outlet/></DashboardLayout>;
}
