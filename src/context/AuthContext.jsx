// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signInWithPopup,
  signOut, sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.js';
import api from '../utils/api.js';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (fbUser) => {
    if (!fbUser) { setUser(null); setProfile(null); setLoading(false); return; }
    setUser(fbUser);
    try {
      const { data } = await api.get('/api/auth/me');
      setProfile(data.user);
    } catch { setProfile(null); }
    setLoading(false);
  };

  useEffect(() => onAuthStateChanged(auth, loadProfile), []);

 const login = async (email, password, selectedRole) => {
  // 🔐 Step 1: Firebase login
  const cred = await signInWithEmailAndPassword(auth, email, password);

  // 🔄 Step 2: Fetch profile from backend
  const { data } = await api.get('/api/auth/me');
  const userProfile = data.user;

  // 🚨 Step 3: ROLE VALIDATION (MAIN FIX)
  if (selectedRole && userProfile.role !== selectedRole) {
    // logout immediately if wrong role
    await signOut(auth);
    throw new Error(`You are not registered as ${selectedRole}`);
  }

  // ✅ Step 4: store correct role
  localStorage.setItem('planex-role', userProfile.role);

  return cred;
 };


 const loginGoogle = async () => {
  const r = await signInWithPopup(auth, googleProvider);
    try {
      await api.post('/api/auth/register', {
        uid: r.user.uid, email: r.user.email,
        name: r.user.displayName || 'User', role: 'student',
      });
    } catch (_) {}
    return r;
  };

  const register = async ({ email, password, name, role='student', phone='', classNum='', subject='' }) => {
    const c = await createUserWithEmailAndPassword(auth, email, password);
    await api.post('/api/auth/register', { uid: c.user.uid, email, name, role, phone, classNum, subject });
    return c;
  };

  const logout = async () => { await signOut(auth); setUser(null); setProfile(null); };
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const refreshProfile = async () => {
    if (!user) return;
    const { data } = await api.get('/api/auth/me');
    setProfile(data.user);
  };

  return (
    <Ctx.Provider value={{
      user, profile, loading, login, loginGoogle, register, logout, resetPassword, refreshProfile,
      isAdmin:   profile?.role === 'admin',
      isTeacher: profile?.role === 'teacher',
      isStudent: profile?.role === 'student',
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
