// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.jsx';

export default function Footer() {
  const s = useSettings();
  return (
    <footer className="bg-navy-950 text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center font-display font-black text-sm text-navy-900">PA</div>
              <span className="font-display font-bold text-lg">{s.coachingName}</span>
            </div>
            <p className="text-xs italic text-white/40 mb-4">"{s.slogan}"</p>
            <p className="text-sm text-white/55 leading-relaxed">{s.aboutText?.slice(0, 120)}…</p>
            <div className="flex gap-2.5 mt-5">
              {s.socialFacebook && <a href={s.socialFacebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center text-white/50 hover:text-gold-400 hover:bg-gold-400/10 transition-all text-sm">f</a>}
              {s.socialInstagram && <a href={s.socialInstagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center text-white/50 hover:text-gold-400 hover:bg-gold-400/10 transition-all text-xs">ig</a>}
              {s.socialYoutube && <a href={s.socialYoutube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center text-white/50 hover:text-gold-400 hover:bg-gold-400/10 transition-all text-xs">yt</a>}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {['/', '/about', '/courses', '/results', '/contact'].map((p, i) => (
                <li key={p}><Link to={p} className="text-sm text-white/55 hover:text-gold-400 transition-colors">{['Home','About','Courses','Results','Contact'][i]}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-5">Contact</h4>
            <ul className="space-y-3.5">
              <li className="flex gap-3 text-sm text-white/55"><MapPin size={15} className="text-gold-400 shrink-0 mt-0.5"/><span>{s.address}</span></li>
              <li className="flex gap-3 text-sm text-white/55"><Phone size={15} className="text-gold-400 shrink-0"/><a href={`tel:${s.mobile}`} className="hover:text-gold-400">+91 {s.mobile}</a></li>
              <li className="flex gap-3 text-sm text-white/55"><Mail size={15} className="text-gold-400 shrink-0"/><span>{s.email}</span></li>
              <li className="flex gap-3 text-sm text-white/55"><Clock size={15} className="text-gold-400 shrink-0"/>Mon–Sat: 7AM – 8PM</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-5">WhatsApp</h4>
            <p className="text-sm text-white/55 mb-4">Chat with us directly for quick answers.</p>
            <a href={`https://wa.me/91${s.mobile}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.304A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="border-t border-white/8 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/35">© {new Date().getFullYear()} {s.coachingName}. All rights reserved.</p>
          <p className="text-xs text-white/25">Built with ❤️ for Education Excellence</p>
        </div>
      </div>
    </footer>
  );
}
