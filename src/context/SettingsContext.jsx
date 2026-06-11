// src/context/SettingsContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api.js';

const defaults = {
  coachingName: 'Planex Academy',
  slogan: 'where plan takes you to the apex',
  address: 'Satsang Nagar Road No. 1, Rajabazar, Jehanabad',
  mobile: '8825144791',
  email: 'info@planexacademy.in',
  heroTitle: 'Planex Academy',
  heroSubtitle: 'Expert coaching for Classes 7–12 in Science, Math & Chemistry.',
  aboutText: "Planex Academy is Jehanabad's most trusted coaching institute.",
  socialFacebook: '', socialInstagram: '', socialYoutube: '',
  mapsEmbedUrl: '',
};

const SC = createContext(defaults);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);

  useEffect(() => {
    api.get('/api/settings')
      .then(r => { if (r.data.settings) setSettings(s => ({ ...s, ...r.data.settings })); })
      .catch(() => {});
  }, []);

  return <SC.Provider value={settings}>{children}</SC.Provider>;
}

export const useSettings = () => useContext(SC);
