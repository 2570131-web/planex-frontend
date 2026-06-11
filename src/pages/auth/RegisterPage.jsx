// src/pages/auth/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth }     from '../../context/AuthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { Spinner }     from '../../components/ui/index.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const s = useSettings();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', classNum:'', role:'student' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to Planex Academy.');
      navigate('/student');
    } catch (err) {
      toast.error(err.message.includes('email-already-in-use') ? 'Email already registered. Please login.' : err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-[#0d2952] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center font-display font-black text-xl text-navy-900 mx-auto mb-3">PA</div>
          <h1 className="font-display font-bold text-xl text-white">{s.coachingName}</h1>
          <p className="text-gold-400 text-xs italic mt-0.5">"{s.slogan}"</p>
        </div>

        <div className="card p-7">
          <h2 className="font-display font-black text-xl text-navy-900 dark:text-white mb-1">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Join Planex Academy today</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Full Name *</label>
              <input name="name" value={form.name} onChange={handle} className="input" placeholder="Your full name" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handle} className="input" placeholder="you@email.com" required />
              </div>
              <div>
                <label className="label">Mobile</label>
                <input name="phone" value={form.phone} onChange={handle} className="input" placeholder="+91 …" />
              </div>
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle} className="input pr-11" placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">I am a</label>
                <select name="role" value={form.role} onChange={handle} className="select">
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label className="label">Class</label>
                <select name="classNum" value={form.classNum} onChange={handle} className="select">
                  <option value="">Select…</option>
                  {['7','8','9','10','11','12'].map(c => <option key={c}>Class {c}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center mt-1">
              {loading ? <Spinner size={17} className="text-navy-900" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            Already have an account? <Link to="/login" className="text-gold-500 font-semibold hover:text-gold-600">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
