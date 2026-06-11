// src/pages/public/ResultsPage.jsx
import { useEffect, useState } from 'react';
import PublicLayout from '../../components/layout/PublicLayout.jsx';
import { Spinner } from '../../components/ui/index.jsx';
import api from '../../utils/api.js';

export default function ResultsPage() {
  const [toppers, setToppers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/api/settings/toppers').then(r => setToppers(r.data.toppers || [])).finally(() => setLoading(false));
  }, []);
  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-navy-950 to-navy-900 py-24 text-center">
        <p className="section-label">Hall of Fame</p>
        <h1 className="font-display font-black text-5xl text-white mb-3">Results & <span className="text-grad">Toppers</span></h1>
        <p className="text-white/50 text-sm max-w-sm mx-auto">Celebrating academic excellence at Planex Academy.</p>
      </div>
      <section className="py-20 bg-gray-50 dark:bg-navy-950 min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex justify-center py-20"><Spinner size={32} className="text-gold-400" /></div>
          ) : toppers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="font-display font-bold text-xl text-navy-900 dark:text-white mb-2">Results Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Top performers will be listed here by the admin.</p>
            </div>
          ) : (
            <>
              {/* Top 3 podium */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                {toppers.slice(0, 3).map((t, i) => (
                  <div key={t.id} className={`card p-8 text-center relative ${i === 0 ? 'ring-2 ring-gold-400 shadow-gold-400/20 shadow-xl' : ''}`}>
                    <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white`}
                      style={{ background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32' }}>
                      {i + 1}
                    </div>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center font-display font-black text-3xl text-navy-900 mx-auto mb-4`}
                      style={{ background: i === 0 ? 'linear-gradient(135deg,#FFD700,#FFA500)' : i === 1 ? 'linear-gradient(135deg,#C0C0C0,#888)' : 'linear-gradient(135deg,#CD7F32,#8B4513)' }}>
                      {t.name?.[0]?.toUpperCase()}
                    </div>
                    <h3 className="font-display font-bold text-lg text-navy-900 dark:text-white">{t.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">{t.course} · {t.classNum} · {t.year}</p>
                    <div className="font-display font-black text-4xl text-gold-500">{t.score}%</div>
                    <div className="mt-3 h-2 bg-gray-100 dark:bg-navy-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full" style={{ width: `${t.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Rest */}
              {toppers.length > 3 && (
                <div className="card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-navy-800">
                      <tr>
                        <th className="th">Rank</th><th className="th">Name</th><th className="th">Course</th>
                        <th className="th">Class</th><th className="th">Score</th><th className="th">Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {toppers.slice(3).map(t => (
                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50">
                          <td className="td font-bold text-gold-500">#{t.rank}</td>
                          <td className="td font-semibold text-navy-900 dark:text-white">{t.name}</td>
                          <td className="td text-gray-500 dark:text-gray-400">{t.course}</td>
                          <td className="td">{t.classNum}</td>
                          <td className="td"><span className="badge badge-green">{t.score}%</span></td>
                          <td className="td text-gray-400">{t.year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
