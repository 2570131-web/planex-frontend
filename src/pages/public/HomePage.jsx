// src/pages/public/HomePage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronRight } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { Spinner } from '../../components/ui/index.jsx';
import api from '../../utils/api.js';

export default function HomePage() {
  const s = useSettings();
  const [courses,      setCourses]      = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [toppers,      setToppers]      = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/courses?active=true'),
      api.get('/api/settings/testimonials'),
      api.get('/api/settings/toppers'),
    ]).then(([c,t,tp]) => {
      setCourses(c.data.courses||[]);
      setTestimonials(t.data.testimonials||[]);
      setToppers(tp.data.toppers||[]);
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const EMOJIS = { science:'🔬', math:'📐', mathematics:'📐', chemistry:'⚗️', physics:'⚡', biology:'🌿' };

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative min-h-[93vh] flex items-center bg-gradient-to-br from-navy-950 via-navy-900 to-[#0d2952] overflow-hidden">
        <div className="absolute inset-0 bg-hero-grid"/>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-400/6 rounded-full blur-[120px] animate-float"/>
        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-float" style={{animationDelay:'2s'}}/>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/25 bg-gold-400/8 text-gold-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"/>
              Jehanabad's Premier Coaching
            </div>

            <h1 className="font-display font-black text-5xl sm:text-6xl text-white leading-[1.08] mb-5 animate-slide-up">
              {s.heroTitle?.split(' ').map((w,i) =>
                i===1 ? <span key={i} className="text-grad"> {w} </span> : w+' '
              )}
            </h1>

            <p className="text-lg text-gold-300/80 italic mb-3 animate-slide-up" style={{animationDelay:'100ms'}}>
              — <span className="text-gold-300 not-italic font-semibold">{s.slogan}</span>
            </p>
            <p className="text-xl sm:text-2xl font-bold text-white mb-3 animate-slide-up" style={{animationDelay:'130ms'}}>
              Unlock Your Academic Potential
            </p>
            <p className="text-base text-white/50 mb-10 max-w-lg animate-slide-up" style={{animationDelay:'150ms'}}>
              {s.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-4 mb-16 animate-slide-up" style={{animationDelay:'200ms'}}>
              <Link to="/register" className="btn-gold btn-lg"><span>Enroll Now</span><ArrowRight size={16}/></Link>
              <Link to="/courses" className="btn-ghost text-white border-white/25 btn-lg">Explore Courses<ChevronRight size={16}/></Link>
            </div>

            <div className="flex flex-wrap gap-8 animate-slide-up" style={{animationDelay:'250ms'}}>
              {[['1000+','Students Mentored'],['95%','Board Success Rate'],['10+ Yrs','Teaching Experience'],['10+','Expert Subjects Covered'],['Expert Faculty','Qualified Teachers'], ['Live Classes','Doubt Support']].map(([n,l])=>(
                <div key={l} className="text-center">
                  <div className="font-display font-black text-2xl text-white">{n}</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="py-24 bg-gray-50 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="section-label">Academic Programs</p>
            <h2 className="section-title">Courses We <span className="text-grad">Offer</span></h2>
          </div>
          {loading ? <div className="flex justify-center py-12"><Spinner size={32} className="text-gold-400"/></div>
          : courses.length === 0
            ? <div className="text-center py-16 text-gray-400">Courses coming soon. Check back later!</div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(c => (
                  <div key={c.id} className="card-hover p-6 flex flex-col">
                    <div className="w-14 h-14 rounded-2xl bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center text-3xl mb-4">
                      {EMOJIS[c.subject?.toLowerCase()]||'📚'}
                    </div>
                    <h3 className="font-display font-bold text-lg text-navy-900 dark:text-white mb-1">{c.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {c.classRange?.split(',').map(cl=>(
                        <span key={cl} className="badge badge-blue text-[10px]">Class {cl.trim()}</span>
                      ))}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">{c.description||'A comprehensive course designed for academic excellence.'}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/8">
                      <span className="font-display font-bold text-lg text-navy-900 dark:text-white">
                        {c.fee>0 ? <>₹{c.fee}<span className="text-xs font-normal text-gray-400">/mo</span></> : <span className="text-green-500 text-sm">Free</span>}
                      </span>
                      <Link to="/register" className="text-xs font-bold text-gold-500 hover:text-gold-600 flex items-center gap-1">Enroll<ArrowRight size={12}/></Link>
                    </div>
                  </div>
                ))}
              </div>
          }
          <div className="text-center mt-10">
            <Link to="/courses" className="btn-ghost text-navy-900 dark:text-white border-gray-200 dark:border-white/20">
              View All Courses <ArrowRight size={15}/>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 bg-white dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label">Why Choose Us</p>
            <h2 className="section-title mb-6">More Than a <span className="text-grad">Coaching Centre</span></h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">{s.aboutText}</p>
            <div className="space-y-5">
              {[
                ['🎯','Personalised Plans','Every student gets a tailored study roadmap crafted by experts.'],
                ['📊','Regular MCQ Tests','Frequent assessments with instant results and detailed analysis.'],
                ['👨‍🏫','Expert Faculty','Highly qualified teachers with years of proven experience.'],
                ['📱','Online Portal','Access materials, tests, and track progress anytime, anywhere.'],
              ].map(([i,t,d])=>(
                <div key={t} className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center text-xl shrink-0">{i}</div>
                  <div><h4 className="font-semibold text-navy-900 dark:text-white text-sm">{t}</h4><p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{d}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl p-10 text-center border border-white/8">
            <div className="text-5xl mb-5">🎓</div>
            <h3 className="font-display font-black text-2xl text-gold-400 mb-3">{s.coachingName}</h3>
            <p className="text-white/60 text-sm italic">"{s.slogan}"</p>
            <Link to="/register" className="btn-gold mt-8 w-full justify-center">Start Learning Today<ArrowRight size={15}/></Link>
          </div>
        </div>
      </section>

      {/* TOPPERS */}
      {toppers.length > 0 && (
        <section className="py-24 bg-gray-50 dark:bg-navy-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="section-label">Hall of Fame</p>
              <h2 className="section-title">Our <span className="text-grad">Star Performers</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {toppers.slice(0,6).map((t,i)=>(
                <div key={t.id} className="card p-6 text-center relative">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                    style={{background:i===0?'#FFD700':i===1?'#C0C0C0':'#CD7F32',color:'#fff'}}>
                    {t.rank}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-display font-black text-2xl text-navy-900 mx-auto mb-3">
                    {t.name?.[0]?.toUpperCase()}
                  </div>
                  <h3 className="font-bold text-navy-900 dark:text-white">{t.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">{t.course} · {t.classNum}</p>
                  <div className="font-display font-black text-3xl text-gold-500">{t.score}%</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.year}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8"><Link to="/results" className="btn-ghost text-navy-900 dark:text-white border-gray-200 dark:border-white/20">View All Results<ArrowRight size={15}/></Link></div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-navy-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="section-label">Student Reviews</p>
              <h2 className="section-title text-white">What <span className="text-grad">Students Say</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map(t=>(
                <div key={t.id} className="glass rounded-2xl p-6">
                  <div className="flex gap-0.5 mb-4">{[...Array(t.rating||5)].map((_,i)=><Star key={i} size={13} className="fill-gold-400 text-gold-400"/>)}</div>
                  <p className="text-white/70 text-sm italic leading-relaxed mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 font-bold text-sm">{t.name?.[0]?.toUpperCase()}</div>
                    <div><div className="text-white text-sm font-semibold">{t.name}</div><div className="text-gold-400 text-xs">{t.role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-gold-400 to-gold-500">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-black text-4xl text-navy-950 mb-4">Ready to Reach the Apex?</h2>
          <p className="text-navy-900/65 text-sm mb-8">Join hundreds of students already on their path to excellence.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-navy-900 text-gold-400 px-8 py-3 rounded-xl font-bold hover:bg-navy-950 transition-all">Enroll Now →</Link>
            <Link to="/contact" className="bg-white/20 border-2 border-navy-900/15 text-navy-900 px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all">Contact Us</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
