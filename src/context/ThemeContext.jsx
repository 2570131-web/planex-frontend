// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
const TC = createContext(null);
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const s = localStorage.getItem('planex-theme');
    return s ? s === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('planex-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <TC.Provider value={{ dark, toggle: () => setDark(d => !d) }}>{children}</TC.Provider>;
}
export const useTheme = () => useContext(TC);

// src/context/SettingsContext.jsx — separate export below
