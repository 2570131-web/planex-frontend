// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, LogOut, LayoutDashboard, GraduationCap } from 'lucide-react';
import { useAuth }     from '../../context/AuthContext.jsx';
import { useTheme }    from '../../context/ThemeContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/results', label: 'Results' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const settings = useSettings();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const dash = profile?.role === 'admin' ? '/admin' : profile?.role === 'teacher' ? '/teacher' : '/student';

  const doLogout = async () => {
    await logout(); toast.success('Logged out'); navigate('/'); setOpen(false);
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-navy-950/96 backdrop-blur-xl border-b border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center font-display font-black text-sm text-navy-900">PA</div>
          <div className="leading-none">
            <div className="font-display font-bold text-navy-900 dark:text-white text-sm">{settings.coachingName}</div>
            <div className="text-[10px] text-gold-400 uppercase tracking-widest font-semibold">Education</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <Link key={n.to} to={n.to}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${pathname === n.to ? 'text-gold-400 bg-gold-400/10' : 'text-navy-700 dark:text-white/65 hover:text-navy-900 dark:hover:text-white hover:bg-white/8'}`}>
              {n.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg text-gray-600 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-white/8 transition-all">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {user ? (
            <>
              <Link to={dash} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-gold-400 hover:bg-gold-400/10 transition-all">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <button onClick={doLogout} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="text-sm text-gray-600 dark:text-white/60 hover:text-black dark:hover:text-white px-3 py-1.5 transition-all">Login</Link>
              <Link to="/register" className="btn-gold btn-sm"><GraduationCap size={14}/> Enroll</Link>
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
      <div className="md:hidden bg-navy-950/98 backdrop-blur-xl border-t border-white/10 px-5 py-5 space-y-3 animate-fade-in">

      {NAV.map(n => (
      <Link
        key={n.to}
        to={n.to}
        onClick={() => setOpen(false)}
        className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
          pathname === n.to
            ? 'text-gold-400 bg-gold-400/10'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        {n.label}
      </Link>
      ))}

      <div className="border-t border-white/10 pt-4 mt-4 space-y-2">

      {user ? (
        <>
          <Link
            to={dash}
            onClick={() => setOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-semibold text-gold-400 hover:bg-gold-400/10"
          >
            Dashboard
          </Link>

          <button
            onClick={doLogout}
            className="w-full text-left px-4 py-3 rounded-xl text-base text-red-400 hover:bg-red-500/10"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 rounded-xl text-base text-white/70 hover:bg-white/10"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-bold text-navy-900 bg-gold-400 text-center"
          >
            Enroll Now
          </Link>
        </>
      )}

    </div>
   </div>
   )}
    </nav>
  );
}
