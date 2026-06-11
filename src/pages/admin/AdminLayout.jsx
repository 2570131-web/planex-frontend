// src/pages/admin/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import {
  LayoutDashboard, GraduationCap, Users, UserCheck,
  BookOpen, FolderOpen, ClipboardList, CreditCard,
  Calendar, Bell, Settings, FileText,
} from 'lucide-react';

const NAV = [
  { label: 'Overview', items: [
    { to: '/admin',              icon: <LayoutDashboard size={17}/>, label: 'Dashboard',   end: true },
  ]},
  { label: 'People', items: [
    { to: '/admin/students',     icon: <GraduationCap size={17}/>,  label: 'Students'    },
    { to: '/admin/teachers',     icon: <Users size={17}/>,           label: 'Teachers'    },
    { to: '/admin/enrollments',  icon: <UserCheck size={17}/>,       label: 'Enrollments' },
  ]},
  { label: 'Content', items: [
    { to: '/admin/courses',      icon: <BookOpen size={17}/>,        label: 'Courses'     },
    { to: '/admin/materials',    icon: <FolderOpen size={17}/>,      label: 'Materials'   },
    { to: '/admin/tests',        icon: <ClipboardList size={17}/>,   label: 'Tests'       },
  ]},
  { label: 'Finance & Track', items: [
    { to: '/admin/payments',     icon: <CreditCard size={17}/>,      label: 'Payments'    },
    { to: '/admin/attendance',   icon: <Calendar size={17}/>,        label: 'Attendance'  },
  ]},
  { label: 'System', items: [
    { to: '/admin/notifications',icon: <Bell size={17}/>,            label: 'Notifications'},
    { to: '/admin/settings',     icon: <Settings size={17}/>,        label: 'Settings'    },
  ]},
];

export default function AdminLayout() {
  return (
    <DashboardLayout navItems={NAV} roleLabel="Admin" roleColor="gold">
      <Outlet />
    </DashboardLayout>
  );
}
