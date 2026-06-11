// src/pages/student/StudentTests.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Play } from 'lucide-react';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader } from '../../components/ui/index.jsx';

export default function StudentTests() {
  const [tests, setTests]     = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/api/tests'), api.get('/api/results/mine')])
      .then(([t,r])=>{ setTests(t.data.tests||[]); setResults(r.data.results||[]); })
      .finally(()=>setLoading(false));
  }, []);

  const doneIds = new Set(results.map(r=>r.testId));

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Tests & Quizzes" description="MCQ tests for your enrolled courses" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Available Tests</h3>
          {tests.length===0 ? <EmptyState icon="📝" title="No Tests Yet" description="No tests have been created for your courses." />
          : (
            <div className="space-y-3">
              {tests.map(t=>{
                const done   = doneIds.has(t.id);
                const result = results.find(r=>r.testId===t.id);
                return (
                  <div key={t.id} className="card p-5 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${done?'bg-green-50 dark:bg-green-900/20 text-green-500':'bg-gold-50 dark:bg-gold-900/20 text-gold-500'}`}>
                      {done?<CheckCircle size={20}/>:<Play size={20}/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-navy-900 dark:text-white">{t.title}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1"><Clock size={10}/>{t.duration} min</span>
                        <span>{t.questions?.length||0} questions</span>
                        <span>{t.totalMarks} marks</span>
                      </div>
                      {done && result && (
                        <div className={`text-xs font-bold mt-1 ${result.passed?'text-green-500':'text-red-500'}`}>
                          Score: {result.percentage}% · {result.passed?'Passed ✓':'Failed ✗'}
                        </div>
                      )}
                    </div>
                    {done
                      ? <span className="badge badge-green text-[10px] shrink-0">Done</span>
                      : <Link to={`/student/tests/${t.id}`} className="btn-gold btn-sm shrink-0"><Play size={12}/> Start</Link>
                    }
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">My Scores</h3>
          {results.length===0
            ? <div className="card p-5 text-center text-sm text-gray-500 dark:text-gray-400">No results yet.</div>
            : (
              <div className="space-y-3">
                {results.map(r=>(
                  <div key={r.id} className="card p-4">
                    <div className="text-xs font-semibold text-navy-900 dark:text-white truncate mb-1">{r.testTitle}</div>
                    <div className="flex items-center justify-between">
                      <span className={`font-display font-black text-2xl ${r.percentage>=80?'text-green-500':r.percentage>=50?'text-yellow-500':'text-red-500'}`}>{r.percentage}%</span>
                      {r.passed?<CheckCircle size={16} className="text-green-500"/>:<XCircle size={16} className="text-red-500"/>}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{r.score}/{r.totalMarks} marks</div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
