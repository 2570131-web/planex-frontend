// src/pages/student/TakeTest.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import { Spinner } from '../../components/ui/index.jsx';

export default function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const startRef = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    api.get(`/api/tests/${id}`)
      .then(r => { setTest(r.data.test); setTimeLeft((r.data.test.duration||30)*60); })
      .catch(() => { toast.error('Test not found'); navigate('/student/tests'); })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!test || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [test, submitted]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const handleSubmit = async (auto=false) => {
    if (submitting) return;
    if (!auto) {
      const ans = Object.keys(answers).length;
      if (ans < test.questions.length && !window.confirm(`Answered ${ans}/${test.questions.length}. Submit anyway?`)) return;
    }
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const { data } = await api.post(`/api/tests/${id}/submit`, {
        answers, timeTaken: Math.round((Date.now()-startRef.current)/1000),
      });
      setResult(data.result);
      setSubmitted(true);
    } catch (err) {
      if (err.message.includes('Already submitted')) { toast.error('Already submitted.'); navigate('/student/tests'); }
      else toast.error(err.message);
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;

  // ── Result screen ──────────────────────────────────────
  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-10 text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center ${result.passed?'bg-green-100 dark:bg-green-900/30':'bg-red-100 dark:bg-red-900/30'}`}>
            {result.passed ? <CheckCircle size={48} className="text-green-500"/> : <XCircle size={48} className="text-red-500"/>}
          </div>
          <div className="font-display font-black text-6xl mb-2" style={{color:result.percentage>=80?'#22c55e':result.percentage>=50?'#f59e0b':'#ef4444'}}>
            {result.percentage}%
          </div>
          <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-white mb-2">
            {result.passed ? '🎉 Congratulations!' : '😔 Keep Practicing!'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Score: <strong>{result.score}</strong> / <strong>{result.totalMarks}</strong> marks
            {!result.passed && ` · Passing: ${test.passingMarks}`}
          </p>
          {/* Per-question review */}
          <div className="text-left space-y-4 mb-8">
            {result.evaluated?.map((item,i) => {
              const q = test.questions.find(q=>q.id===item.questionId)||test.questions[i];
              return (
                <div key={i} className={`p-4 rounded-xl border-l-4 ${item.correct?'border-green-400 bg-green-50 dark:bg-green-900/10':'border-red-400 bg-red-50 dark:bg-red-900/10'}`}>
                  <div className="text-sm font-semibold text-navy-900 dark:text-white mb-2">Q{i+1}. {q?.text}</div>
                  {q?.options?.map((opt,oi)=>(
                    <div key={oi} className={`text-xs px-3 py-1.5 rounded-lg mb-1 ${oi===item.correctAnswer?'bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-semibold':oi===item.studentAnswer&&!item.correct?'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300':'text-gray-600 dark:text-gray-400'}`}>
                      {String.fromCharCode(65+oi)}. {opt}
                      {oi===item.correctAnswer&&' ✓'}{oi===item.studentAnswer&&!item.correct&&' ✗'}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <button onClick={()=>navigate('/student/tests')} className="btn-gold w-full justify-center">Back to Tests</button>
        </div>
      </div>
    );
  }

  const q    = test.questions[current];
  const pct  = (current/test.questions.length)*100;
  const low  = timeLeft < 60;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="card p-4 mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-navy-900 dark:text-white">{test.title}</h1>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Question {current+1} of {test.questions.length}</div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm ${low?'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse':'bg-gray-100 dark:bg-navy-800 text-navy-900 dark:text-white'}`}>
          <Clock size={15} className={low?'text-red-500':'text-gold-500'}/>{fmt(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-gray-100 dark:bg-navy-800 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-500" style={{width:`${pct}%`}}/>
      </div>

      {/* Question */}
      <div className="card p-6 mb-4">
        {low && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 mb-4 text-red-600 dark:text-red-400 text-xs font-semibold">
            <AlertTriangle size={14}/> Less than 1 minute remaining!
          </div>
        )}
        <h2 className="font-semibold text-navy-900 dark:text-white leading-relaxed mb-6">{current+1}. {q.text}</h2>
        <div className="space-y-3">
          {q.options.map((opt,i)=>(
            <button key={i} onClick={()=>setAnswers(a=>({...a,[q.id]:i}))}
              className={`w-full text-left px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all ${answers[q.id]===i?'border-gold-400 bg-gold-50 dark:bg-gold-900/20 text-navy-900 dark:text-white':'border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gold-300 hover:bg-gold-50/50 dark:hover:bg-gold-900/10'}`}>
              <span className="font-bold text-gold-500 mr-3">{String.fromCharCode(65+i)}.</span>{opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={()=>setCurrent(c=>Math.max(0,c-1))} disabled={current===0} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm disabled:opacity-40">← Prev</button>
        <div className="flex gap-1 flex-wrap justify-center max-w-xs">
          {test.questions.map((_,i)=>(
            <button key={i} onClick={()=>setCurrent(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${i===current?'bg-navy-900 dark:bg-gold-400 text-white dark:text-navy-900':answers[test.questions[i].id]!==undefined?'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-300':'bg-gray-100 dark:bg-navy-800 text-gray-500 dark:text-gray-400'}`}>
              {i+1}
            </button>
          ))}
        </div>
        {current<test.questions.length-1
          ? <button onClick={()=>setCurrent(c=>c+1)} className="btn-gold btn-sm">Next →</button>
          : <button onClick={()=>handleSubmit(false)} disabled={submitting} className="btn-sm bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-1.5">
              {submitting?<Spinner size={14} className="text-white"/>:'✓ Submit'}
            </button>
        }
      </div>
    </div>
  );
}
