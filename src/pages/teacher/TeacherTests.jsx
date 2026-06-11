// src/pages/teacher/TeacherTests.jsx
import { useEffect, useState } from 'react';
import { Plus, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader, Modal, ConfirmDialog } from '../../components/ui/index.jsx';

const makeQ = () => ({ id: Math.random().toString(36).slice(2), text:'', options:['','','',''], correctAnswer:0, marks:1 });

export default function TeacherTests() {
  const { profile } = useAuth();
  const [tests, setTests]     = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState({ title:'', courseId:'', duration:30 });
  const [questions, setQ]     = useState([makeQ()]);
  const [saving, setSaving]   = useState(false);
  const [deleteId, setDel]    = useState(null);
  const [deleting, setDeling] = useState(false);

  const load = () => Promise.all([api.get('/api/tests'), api.get('/api/courses')])
    .then(([t,c])=>{ setTests(t.data.tests||[]); setCourses((c.data.courses||[]).filter(x=>x.teacherId===profile?.uid)); })
    .finally(()=>setLoading(false));

  useEffect(()=>{ load(); },[profile]);

  const updateQ   = (i,k,v) => setQ(qs=>qs.map((q,qi)=>qi===i?{...q,[k]:v}:q));
  const updateOpt = (qi,oi,v) => setQ(qs=>qs.map((q,i)=>i===qi?{...q,options:q.options.map((o,j)=>j===oi?v:o)}:q));

  const save = async e => {
    e.preventDefault();
    for (const q of questions) { if (!q.text.trim()) return toast.error('All questions need text'); if (q.options.some(o=>!o.trim())) return toast.error('Fill all options'); }
    setSaving(true);
    try { await api.post('/api/tests',{...form,questions,duration:+form.duration}); toast.success('Test created!'); setModal(false); setForm({title:'',courseId:'',duration:30}); setQ([makeQ()]); load(); }
    catch(err){ toast.error(err.message); } finally { setSaving(false); }
  };

  const doDelete = async () => {
    setDeling(true);
    try { await api.delete(`/api/tests/${deleteId}`); toast.success('Deleted'); setDel(null); load(); }
    catch(err){ toast.error(err.message); } finally { setDeling(false); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Tests" description="Create MCQ tests for your courses"
        action={<button onClick={()=>setModal(true)} className="btn-gold btn-sm"><Plus size={15}/> Create Test</button>}/>
      {tests.filter(t => courses.some(c => c.id === t.courseId)).length === 0 ? <EmptyState icon="📝" title="No Tests Yet" action={<button onClick={()=>setModal(true)} className="btn-gold">Create Test</button>}/>
      : <div className="space-y-3">{tests.filter(t => courses.some(c => c.id === t.courseId)).map(t=>(
        <div key={t.id} className="card p-5 flex items-center gap-4">
          <div className="text-2xl">📝</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-navy-900 dark:text-white">{t.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.questions?.length||0} questions · {t.duration} min · {t.totalMarks} marks</div>
          </div>
          <span className={`badge ${t.isActive?'badge-green':'badge-yellow'}`}>{t.isActive?'Active':'Draft'}</span>
          {t.createdBy === profile?.uid && (
  <button 
    onClick={()=>setDel(t.id)} 
    className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
  >
    <Trash2 size={15}/>
  </button>
)}
        </div>
      ))}</div>}

      <Modal open={modal} onClose={()=>setModal(false)} title="Create Test" maxWidth="max-w-2xl">
        <form onSubmit={save} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="label">Title *</label><input name="title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="input" required placeholder="e.g. Chapter 5 Quiz"/></div>
            <div><label className="label">Course *</label><select name="courseId" value={form.courseId} onChange={e=>setForm(f=>({...f,courseId:e.target.value}))} className="select" required><option value="">Select…</option>{courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
            <div><label className="label">Duration (min)</label><input type="number" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))} className="input" min={1}/></div>
          </div>
          <div className="border-t border-gray-100 dark:border-white/10 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-navy-900 dark:text-white">Questions ({questions.length})</h3>
              <button type="button" onClick={()=>setQ(qs=>[...qs,makeQ()])} className="text-xs text-gold-500 font-semibold flex items-center gap-1"><PlusCircle size={13}/> Add</button>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 scrollbar-hide">
              {questions.map((q,qi)=>(
                <div key={q.id} className="bg-gray-50 dark:bg-navy-800 rounded-xl p-4">
                  <div className="flex justify-between mb-2"><span className="text-xs font-bold text-gold-500">Q{qi+1}</span>{questions.length>1&&<button type="button" onClick={()=>setQ(qs=>qs.filter((_,i)=>i!==qi))} className="text-red-400"><MinusCircle size={14}/></button>}</div>
                  <input value={q.text} onChange={e=>updateQ(qi,'text',e.target.value)} className="input text-sm mb-3" placeholder="Question text…" required/>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {q.options.map((opt,oi)=>(
                      <div key={oi} className="flex items-center gap-2">
                        <input type="radio" name={`c${qi}`} checked={q.correctAnswer===oi} onChange={()=>updateQ(qi,'correctAnswer',oi)} className="accent-gold-400"/>
                        <input value={opt} onChange={e=>updateOpt(qi,oi,e.target.value)} className="input text-xs py-1.5 flex-1" placeholder={`Option ${String.fromCharCode(65+oi)}`} required/>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">Marks: <input type="number" value={q.marks} onChange={e=>updateQ(qi,'marks',+e.target.value)} className="input py-1 text-xs w-14" min={1}/></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={()=>setModal(false)} className="btn-ghost border-gray-200 dark:border-white/20 text-gray-700 dark:text-white btn-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold btn-sm">{saving?<Spinner size={14} className="text-navy-900"/>:'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={()=>setDel(null)} onConfirm={doDelete} title="Delete Test" message="Delete this test permanently?" loading={deleting}/>
    </div>
  );
}
