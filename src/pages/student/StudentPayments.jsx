// src/pages/student/StudentPayments.jsx
import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader } from '../../components/ui/index.jsx';

export default function StudentPayments() {
  const [payments, setPayments]   = useState([]);
  const [enrollments, setEnroll]  = useState([]);
  const [loading, setLoading]     = useState(true);
  const [paying, setPaying]       = useState(null);

  const load = () => Promise.all([api.get('/api/payments/mine'), api.get('/api/enrollments/mine')])
    .then(([p,e])=>{ setPayments(p.data.payments||[]); setEnroll(e.data.enrollments||[]); })
    .finally(()=>setLoading(false));

  useEffect(()=>{ load(); },[]);

  const requestPayment = async (enrollment) => {
    setPaying(enrollment.id);
    try {
      await api.post('/api/payments', { enrollmentId: enrollment.id, courseId: enrollment.courseId, courseName: enrollment.courseName, amount: enrollment.courseFee||0 });
      toast.success('Payment request submitted! Admin will approve shortly.');
      load();
    } catch(e){ toast.error(e.message); }
    finally { setPaying(null); }
  };

  const pendingEnroll = enrollments.filter(e=>e.paymentStatus!=='paid'&&!payments.find(p=>p.enrollmentId===e.id&&p.status==='pending'));

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400"/></div>;
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Payments" description="Your payment history and pending dues" />
      {pendingEnroll.length>0 && (
        <div className="card p-5 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 mb-6">
          <h3 className="font-semibold text-navy-900 dark:text-white mb-3">⚠️ Pending Payments</h3>
          {pendingEnroll.map(e=>(
            <div key={e.id} className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium text-sm text-navy-900 dark:text-white">{e.courseName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{e.courseFee>0?`₹${e.courseFee}/month`:'Free'}</div>
              </div>
              <button onClick={()=>requestPayment(e)} disabled={paying===e.id} className="btn-gold btn-sm">
                {paying===e.id?<Spinner size={14} className="text-navy-900"/>:<><CreditCard size={13}/> Pay Now</>}
              </button>
            </div>
          ))}
        </div>
      )}
      {payments.length===0 ? <EmptyState icon="💳" title="No Payments Yet" description="Your payment history will appear here." />
      : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-navy-800"><tr><th className="th">Course</th><th className="th">Amount</th><th className="th">Invoice</th><th className="th">Status</th></tr></thead>
            <tbody>
              {payments.map(p=>(
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50">
                  <td className="td font-medium text-navy-900 dark:text-white">{p.courseName}</td>
                  <td className="td">₹{p.amount}</td>
                  <td className="td font-mono text-xs text-gray-500">{p.invoiceNumber}</td>
                  <td className="td"><span className={`badge ${p.status==='paid'?'badge-green':p.status==='failed'?'badge-red':'badge-yellow'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
