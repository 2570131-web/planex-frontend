// src/pages/admin/AdminSettings.jsx
import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import { PageHeader, Spinner, Modal } from '../../components/ui/index.jsx';

const SECTIONS = [
  { id:'institute', title:'🏫 Institute', fields:[
    { name:'coachingName', label:'Coaching Name',   placeholder:'Planex Academy' },
    { name:'slogan',       label:'Slogan',           placeholder:'where plan takes you to the apex' },
    { name:'address',      label:'Address',          placeholder:'Satsang Nagar Road No. 1, Rajabazar, Jehanabad' },
    { name:'mobile',       label:'Mobile',           placeholder:'8825144791' },
    { name:'email',        label:'Email',            placeholder:'info@planexacademy.in' },
  ]},
  { id:'homepage', title:'🏠 Homepage', fields:[
    { name:'heroTitle',    label:'Hero Title',       placeholder:'Unlock Your Academic Potential' },
    { name:'heroSubtitle', label:'Hero Subtitle',    placeholder:'Expert coaching…', textarea:true },
  ]},
  { id:'about', title:'ℹ️ About Page', fields:[
    { name:'aboutText',    label:'About Text',       placeholder:"Planex Academy is…", textarea:true },
  ]},
  { id:'social', title:'📱 Social Links', fields:[
    { name:'socialFacebook',  label:'Facebook URL',  placeholder:'https://facebook.com/…' },
    { name:'socialInstagram', label:'Instagram URL', placeholder:'https://instagram.com/…' },
    { name:'socialYoutube',   label:'YouTube URL',   placeholder:'https://youtube.com/…' },
    { name:'mapsEmbedUrl',    label:'Google Maps Embed URL', placeholder:'https://maps.google.com/maps?…' },
  ]},
];

export default function AdminSettings() {
  const [settings,     setSettings]     = useState({});
  const [testimonials, setTestimonials] = useState([]);
  const [toppers,      setToppers]      = useState([]);
  const [loading,  setLoading]   = useState(true);
  const [saving,   setSaving]    = useState(false);
  const [activeTab, setTab]      = useState('institute');

  // Testimonial modal
  const [tModal,  setTModal]  = useState(false);
  const [tForm,   setTForm]   = useState({ name:'', role:'', text:'', rating:5 });
  const [tSaving, setTSaving] = useState(false);
  const [tDelId,  setTDelId]  = useState(null);

  // Topper modal
  const [pModal,  setPModal]  = useState(false);
  const [pForm,   setPForm]   = useState({ name:'', score:'', rank:1, course:'', classNum:'', year:new Date().getFullYear().toString() });
  const [pSaving, setPSaving] = useState(false);
  const [pDelId,  setPDelId]  = useState(null);

  const loadAll = () => Promise.all([
    api.get('/api/settings'),
    api.get('/api/settings/testimonials'),
    api.get('/api/settings/toppers'),
  ]).then(([s,t,tp]) => {
    setSettings(s.data.settings || {});
    setTestimonials(t.data.testimonials || []);
    setToppers(tp.data.toppers || []);
  }).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { loadAll(); }, []);

  const handle = e => setSettings(s => ({ ...s, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try { await api.put('/api/settings', settings); toast.success('Settings saved!'); }
    catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  // Testimonials
  const addTestimonial = async e => {
    e.preventDefault();
    if (!tForm.name || !tForm.text) return toast.error('Name and review required');
    setTSaving(true);
    try { await api.post('/api/settings/testimonials', tForm); toast.success('Added!'); setTModal(false); setTForm({ name:'', role:'', text:'', rating:5 }); loadAll(); }
    catch (err) { toast.error(err.message); } finally { setTSaving(false); }
  };
  const delTestimonial = async id => {
    setTDelId(id);
    try { await api.delete(`/api/settings/testimonials/${id}`); toast.success('Deleted'); loadAll(); }
    catch (err) { toast.error(err.message); } finally { setTDelId(null); }
  };

  // Toppers
  const addTopper = async e => {
    e.preventDefault();
    setPSaving(true);
    try { await api.post('/api/settings/toppers', pForm); toast.success('Topper added!'); setPModal(false); setPForm({ name:'', score:'', rank:1, course:'', classNum:'', year:new Date().getFullYear().toString() }); loadAll(); }
    catch (err) { toast.error(err.message); } finally { setPSaving(false); }
  };
  const delTopper = async id => {
    setPDelId(id);
    try { await api.delete(`/api/settings/toppers/${id}`); toast.success('Deleted'); loadAll(); }
    catch (err) { toast.error(err.message); } finally { setPDelId(null); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400" /></div>;

  const allTabs = [...SECTIONS.map(s => ({ id:s.id, label:s.title })), { id:'testimonials', label:'⭐ Testimonials' }, { id:'toppers', label:'🏆 Toppers' }];
  const currentSection = SECTIONS.find(s => s.id === activeTab);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Site Settings" description="Dynamically control all website content — no code required" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab nav */}
        <div className="card p-3 space-y-0.5 lg:sticky lg:top-4 h-fit">
          {allTabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab===t.id?'bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400':'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-5">
          {/* Section form */}
          {currentSection && (
            <form onSubmit={save}>
              <div className="card p-6 mb-4">
                <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white mb-5">{currentSection.title}</h2>
                <div className="space-y-4">
                  {currentSection.fields.map(f => (
                    <div key={f.name}>
                      <label className="label">{f.label}</label>
                      {f.textarea
                        ? <textarea name={f.name} value={settings[f.name]||''} onChange={handle} className="input min-h-[100px] resize-y" placeholder={f.placeholder}/>
                        : <input name={f.name} value={settings[f.name]||''} onChange={handle} className="input" placeholder={f.placeholder}/>}
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-gold w-full justify-center">
                {saving ? <Spinner size={17} className="text-navy-900"/> : <><Save size={15}/> Save {currentSection.title}</>}
              </button>
            </form>
          )}

          {/* Testimonials tab */}
          {activeTab === 'testimonials' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white">⭐ Testimonials</h2>
                <button onClick={() => setTModal(true)} className="btn-gold btn-sm"><Plus size={14}/> Add</button>
              </div>
              {testimonials.length === 0
                ? <div className="text-center py-10 text-gray-400 text-sm">No testimonials yet. Add your first student review.</div>
                : <div className="space-y-3">
                    {testimonials.map(t => (
                      <div key={t.id} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-navy-800 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center font-bold text-gold-600 dark:text-gold-400 shrink-0">{t.name?.[0]?.toUpperCase()}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm text-navy-900 dark:text-white">{t.name}</span>
                            <span className="badge badge-gold text-[10px]">{t.role}</span>
                          </div>
                          <div className="flex gap-0.5 mb-1">{[...Array(t.rating||5)].map((_,i)=><Star key={i} size={11} className="fill-gold-400 text-gold-400"/>)}</div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-2">"{t.text}"</p>
                        </div>
                        <button onClick={() => delTestimonial(t.id)} disabled={tDelId===t.id} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0">
                          {tDelId===t.id ? <Spinner size={13} className="text-red-400"/> : <Trash2 size={14}/>}
                        </button>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* Toppers tab */}
          {activeTab === 'toppers' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white">🏆 Toppers / Results</h2>
                <button onClick={() => setPModal(true)} className="btn-gold btn-sm"><Plus size={14}/> Add</button>
              </div>
              {toppers.length === 0
                ? <div className="text-center py-10 text-gray-400 text-sm">No toppers added yet. Add your best performers.</div>
                : <div className="space-y-3">
                    {toppers.map(t => (
                      <div key={t.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-navy-800 rounded-xl">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                          style={{background:t.rank===1?'#FFD700':t.rank===2?'#C0C0C0':t.rank===3?'#CD7F32':'#6b7280'}}>
                          #{t.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-navy-900 dark:text-white">{t.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{t.course} · {t.classNum} · {t.year}</div>
                        </div>
                        <div className="font-display font-black text-xl text-gold-500">{t.score}%</div>
                        <button onClick={() => delTopper(t.id)} disabled={pDelId===t.id} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0">
                          {pDelId===t.id ? <Spinner size={13} className="text-red-400"/> : <Trash2 size={14}/>}
                        </button>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}
        </div>
      </div>

      {/* Testimonial modal */}
      <Modal open={tModal} onClose={() => setTModal(false)} title="Add Testimonial">
        <form onSubmit={addTestimonial} className="space-y-4">
          <div><label className="label">Student Name *</label><input value={tForm.name} onChange={e=>setTForm(f=>({...f,name:e.target.value}))} className="input" required placeholder="Rahul Kumar"/></div>
          <div><label className="label">Role / Course</label><input value={tForm.role} onChange={e=>setTForm(f=>({...f,role:e.target.value}))} className="input" placeholder="Class 10 Science Student"/></div>
          <div><label className="label">Review *</label><textarea value={tForm.text} onChange={e=>setTForm(f=>({...f,text:e.target.value}))} className="input min-h-[90px]" required placeholder="What does this student say?"/></div>
          <div><label className="label">Rating (1–5)</label>
            <div className="flex gap-2 mt-1">
              {[1,2,3,4,5].map(n=>(
                <button key={n} type="button" onClick={()=>setTForm(f=>({...f,rating:n}))}
                  className={`w-10 h-10 rounded-xl text-lg transition-all ${tForm.rating>=n?'bg-gold-100 dark:bg-gold-900/30 text-gold-500 scale-110':'bg-gray-100 dark:bg-navy-800 text-gray-300'}`}>★</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={()=>setTModal(false)} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm">Cancel</button>
            <button type="submit" disabled={tSaving} className="btn-gold btn-sm">{tSaving?<Spinner size={14} className="text-navy-900"/>:'Add'}</button>
          </div>
        </form>
      </Modal>

      {/* Topper modal */}
      <Modal open={pModal} onClose={() => setPModal(false)} title="Add Topper">
        <form onSubmit={addTopper} className="space-y-4">
          <div><label className="label">Student Name *</label><input value={pForm.name} onChange={e=>setPForm(f=>({...f,name:e.target.value}))} className="input" required placeholder="Rahul Kumar"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Score (%) *</label><input type="number" value={pForm.score} onChange={e=>setPForm(f=>({...f,score:e.target.value}))} className="input" required min={0} max={100} placeholder="98.5"/></div>
            <div><label className="label">Rank</label><input type="number" value={pForm.rank} onChange={e=>setPForm(f=>({...f,rank:+e.target.value}))} className="input" min={1}/></div>
            <div><label className="label">Course</label><input value={pForm.course} onChange={e=>setPForm(f=>({...f,course:e.target.value}))} className="input" placeholder="Science"/></div>
            <div><label className="label">Class</label><input value={pForm.classNum} onChange={e=>setPForm(f=>({...f,classNum:e.target.value}))} className="input" placeholder="Class 10"/></div>
            <div className="col-span-2"><label className="label">Year</label><input value={pForm.year} onChange={e=>setPForm(f=>({...f,year:e.target.value}))} className="input" placeholder="2025"/></div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={()=>setPModal(false)} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm">Cancel</button>
            <button type="submit" disabled={pSaving} className="btn-gold btn-sm">{pSaving?<Spinner size={14} className="text-navy-900"/>:'Add Topper'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
