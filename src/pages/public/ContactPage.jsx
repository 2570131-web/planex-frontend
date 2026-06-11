// src/pages/public/ContactPage.jsx
import { sendMessage } from '../../services/api';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import PublicLayout from '../../components/layout/PublicLayout.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { Spinner } from '../../components/ui/index.jsx';

export default function ContactPage() {
  const s = useSettings();
  const [form, setForm] = useState({ name:'', phone:'', email:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const handle = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const submit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await sendMessage(form);

    toast.success('Message sent successfully!');
    setForm({ name:'', phone:'', email:'', subject:'', message:'' });

  } catch (err) {
    console.error(err);
    toast.error('Failed to send message');
  }

  setLoading(false);
};
  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-navy-950 to-navy-900 py-24 text-center">
        <p className="section-label">Get In Touch</p>
        <h1 className="font-display font-black text-5xl text-white mb-3">Contact <span className="text-grad">Us</span></h1>
        <p className="text-white/50 text-sm max-w-sm mx-auto">Reach out for admissions, queries, or to book a free demo class.</p>
      </div>
      <section className="py-16 bg-white dark:bg-navy-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-5">
            <div className="bg-navy-900 rounded-3xl p-8 border border-white/8">
              <h3 className="font-display font-bold text-xl text-white mb-6">{s.coachingName}</h3>
              {[[<MapPin size={17}/>,s.address],[<Phone size={17}/>,`+91 ${s.mobile}`],[<Mail size={17}/>,s.email],[<Clock size={17}/>,'Mon–Sat: 7AM – 8PM']].map(([icon,val],i)=>(
                <div key={i} className="flex gap-4 mb-5 last:mb-0">
                  <div className="w-9 h-9 rounded-lg bg-gold-400/12 text-gold-400 flex items-center justify-center shrink-0">{icon}</div>
                  <div className="text-sm text-white/70 mt-1.5">{val}</div>
                </div>
              ))}
            </div>
            <a href={`https://wa.me/91${s.mobile}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-all">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.304A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
              Chat on WhatsApp (+91 {s.mobile})
            </a>
            {s.mapsEmbedUrl && (
              <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/8">
                <iframe src={s.mapsEmbedUrl} width="100%" height="240" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
              </div>
            )}
          </div>
          <form onSubmit={submit} className="card p-8 space-y-4 h-fit">
            <h3 className="font-display font-bold text-xl text-navy-900 dark:text-white">Send a Message</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Name *</label><input name="name" value={form.name} onChange={handle} className="input" required placeholder="Your name"/></div>
              <div><label className="label">Mobile</label><input name="phone" value={form.phone} onChange={handle} className="input" placeholder="+91 …"/></div>
            </div>
            <div><label className="label">Email</label><input name="email" type="email" value={form.email} onChange={handle} className="input" placeholder="you@email.com"/></div>
            <div><label className="label">Subject</label>
              <select name="subject" value={form.subject} onChange={handle} className="select">
                <option value="">Select topic…</option>
                <option>Admission Enquiry</option><option>Fee Structure</option><option>Demo Class</option><option>Other</option>
              </select>
            </div>
            <div><label className="label">Message *</label><textarea name="message" value={form.message} onChange={handle} className="input min-h-[110px] resize-y" required placeholder="Your message…"/></div>
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
              {loading ? <Spinner size={17} className="text-navy-900"/> : <><Send size={15}/> Send Message</>}
            </button>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
