// src/components/layout/DashboardLayout.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, LogOut, X } from 'lucide-react';
import { useAuth }     from '../../context/AuthContext.jsx';
import { useTheme }    from '../../context/ThemeContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children, navItems, roleLabel, roleColor = 'gold' }) {
  const [open, setOpen] = useState(false);
  const { profile, logout } = useAuth();
  const { dark, toggle }   = useTheme();
  const settings           = useSettings();
  const navigate           = useNavigate();

  const doLogout = async () => {
    await logout(); toast.success('Logged out'); navigate('/');
  };

  const avatarColor = { gold: 'from-gold-400 to-gold-500 text-navy-900', blue: 'from-blue-400 to-blue-600 text-white', purple: 'from-purple-400 to-purple-600 text-white' };

  const SidebarContent = ({ onNav }) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center font-display font-black text-sm text-navy-900 shrink-0">PA</div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-none">{settings.coachingName}</div>
            <div className="text-[10px] text-gold-400 mt-0.5 font-semibold">{roleLabel} Portal</div>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-5 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor[roleColor]} flex items-center justify-center font-bold shrink-0`}>
            {profile?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <div className=" text-white dark:text-gold-100 text-sm font-semibold truncate">{profile?.name || 'User'}</div>
            <div className="text-gray-700 dark:text-white/60 text-xs truncate">{profile?.email}</div>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map(group => (
          <div key={group.label} className="mb-3">
            <div className="text-[9px] font-bold uppercase tracking-[2.5px] text-white/25 px-3 mb-1">{group.label}</div>
            {group.items.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end}
                onClick={onNav}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-white/8 space-y-0.5">
        <button onClick={toggle} className="sidebar-link w-full">
          {dark ? <Sun size={17}/> : <Moon size={17}/>}
          <span>{dark ? 'Light' : 'Dark'} Mode</span>
        </button>
        <button onClick={doLogout} className="sidebar-link w-full !text-red-400 hover:!bg-red-500/10">
          <LogOut size={17}/> <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-navy-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-navy-950 border-r border-white/8">
        <SidebarContent onNav={undefined} />
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-navy-950 border-r border-white/8 shadow-2xl">
            <SidebarContent onNav={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white dark:bg-navy-900 border-b border-gray-100 dark:border-white/8 flex items-center px-4 gap-3 shrink-0">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/8">
            <Menu size={20}/>
          </button>
          <div className="flex-1"/>
          <button onClick={toggle} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 transition-all">
            {dark ? <Sun size={17}/> : <Moon size={17}/>}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-5 sm:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
