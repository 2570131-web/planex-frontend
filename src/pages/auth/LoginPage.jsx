// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth }     from '../../context/AuthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { Spinner }     from '../../components/ui/index.jsx';

export default function LoginPage() {
  const { login, loginGoogle, profile } = useAuth();
  const s = useSettings();
  const navigate = useNavigate();
  const [tab, setTab]         = useState('student'); // student | teacher | admin
  const [email, setEmail]     = useState('');
  const [password, setPw]     = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGL]     = useState(false);

  const redirectByRole = (role) => {
    if (role === 'admin')   navigate('/admin');
    else if (role === 'teacher') navigate('/teacher');
    else navigate('/student');
  };

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, tab); // 👈 PASS ROLE
      toast.success('Welcome back!');
      // profile loads async; use a timeout fallback
      
      redirectByRole(tab);

    } catch (err) {
      toast.error(err.message.includes('user-not-found') || err.message.includes('wrong-password') || err.message.includes('invalid-credential')
        ? 'Invalid email or password' : err.message);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGL(true);
    try {
      await loginGoogle();
      toast.success('Welcome!');
      navigate('/student');
    } catch (err) { toast.error(err.message); }
    finally { setGL(false); }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-navy-950 via-navy-900 to-[#0d2952]">
      {/* Left branding */}
      <div className="hidden lg:flex flex-col justify-center px-20 w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-grid" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/6 rounded-full blur-[100px]" />
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center font-display font-black text-2xl text-navy-900 mb-8">PA</div>
          <h1 className="font-display font-black text-5xl text-white leading-tight mb-4">{s.coachingName}</h1>
          <p className="text-gold-400 italic text-lg mb-6">"{s.slogan}"</p>
          <p className="text-white/40 text-sm max-w-xs leading-relaxed">{s.address}</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center font-display font-black text-xl text-navy-900 mx-auto mb-2">PA</div>
            <div className="font-display font-bold text-white text-lg">{s.coachingName}</div>
          </div>

          <div className="card p-8">
            <h2 className="font-display font-black text-2xl text-navy-900 dark:text-white mb-1">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Sign in to continue</p>

            {/* Role tabs */}
            <div className="flex bg-gray-100 dark:bg-navy-800 rounded-xl p-1 mb-6">
              {['student', 'teacher', 'admin'].map(r => (
                <button key={r} onClick={() => setTab(r)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${tab === r ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}>
                  {r === 'student' ? '🎓' : r === 'teacher' ? '👨‍🏫' : '⚙️'} {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@email.com" required />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPw(e.target.value)} className="input pr-11" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
                {loading ? <Spinner size={17} className="text-navy-900" /> : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
            </div>

            <button onClick={handleGoogle} disabled={gLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border-2 border-gray-100 dark:border-white/10 hover:border-gold-400 text-navy-900 dark:text-white font-semibold text-sm transition-all">
              {gLoading ? <Spinner size={17} className="text-gold-400" /> : (
                <><svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Continue with Google</>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              No account? <Link to="/register" className="text-gold-500 font-semibold hover:text-gold-600">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
