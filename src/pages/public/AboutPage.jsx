// src/pages/public/AboutPage.jsx
import PublicLayout from '../../components/layout/PublicLayout.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
export default function AboutPage() {
  const s = useSettings();
  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-navy-950 to-navy-900 py-24 text-center">
        <p className="section-label">Our Story</p>
        <h1 className="font-display font-black text-5xl text-white mb-3">About <span className="text-grad">{s.coachingName}</span></h1>
        <p className="text-white/50 italic text-sm max-w-md mx-auto">"{s.slogan}"</p>
      </div>
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-label">Who We Are</p>
            <h2 className="section-title mb-4">Excellence in <span className="text-grad">Education</span></h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{s.aboutText}</p>
          </div>
          <div className="bg-navy-900 rounded-3xl p-10 text-center border border-white/8">
            <div className="text-6xl mb-4">🏫</div>
            <div className="font-display font-black text-2xl text-gold-400 mb-2">{s.coachingName}</div>
            <div className="text-white/50 text-sm">{s.address}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-navy-900 rounded-2xl p-8 border border-white/8">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="font-display font-bold text-xl text-gold-400 mb-3">Our Mission</h3>
            <p className="text-white/65 text-sm leading-relaxed">To provide affordable, high-quality coaching that empowers every student with knowledge, critical thinking, and the confidence to achieve their dreams.</p>
          </div>
          <div className="bg-gold-50 dark:bg-gold-900/15 rounded-2xl p-8 border border-gold-200/50 dark:border-gold-900/30">
            <div className="text-3xl mb-4">🔭</div>
            <h3 className="font-display font-bold text-xl text-navy-900 dark:text-gold-400 mb-3">Our Vision</h3>
            <p className="text-gray-600 dark:text-white/65 text-sm leading-relaxed">To be Bihar's leading educational institution, transforming students into thinkers, innovators, and future leaders through excellence in teaching.</p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
