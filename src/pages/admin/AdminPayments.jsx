// src/pages/admin/AdminPayments.jsx
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import { Spinner, EmptyState, PageHeader, SearchInput, StatCard, Table } from '../../components/ui/index.jsx';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');

  const load = () => api.get('/api/payments')
    .then(r => setPayments(r.data.payments || []))
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const approve = async id => {
    try { await api.patch(`/api/payments/${id}/approve`); toast.success('Payment approved!'); load(); }
    catch (err) { toast.error(err.message); }
  };
  const reject  = async id => {
    try { await api.patch(`/api/payments/${id}/reject`); toast.success('Payment rejected'); load(); }
    catch (err) { toast.error(err.message); }
  };

  const paid    = payments.filter(p => p.status === 'paid');
  const pending = payments.filter(p => p.status === 'pending');
  const totalRevenue = paid.reduce((s, p) => s + (p.amount || 0), 0);

  const filtered = payments.filter(p =>
    (filter === 'all' || p.status === filter) &&
    (p.studentName?.toLowerCase().includes(search.toLowerCase()) ||
     p.courseName?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} className="text-gold-400" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader title="Payments" description="Manage student payments and generate receipts" />

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="💰" label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="green" />
        <StatCard icon="⏳" label="Pending"        value={pending.length} color="gold" />
        <StatCard icon="✅" label="Approved"        value={paid.length}    color="blue" />
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search payments…" />
        <div className="flex gap-1.5">
          {['all','pending','paid','failed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter===f?'bg-navy-900 dark:bg-gold-400 text-white dark:text-navy-900':'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-navy-700'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="💳" title="No Payments Found" description="Student payments will appear here." />
      ) : (
        <Table headers={['Student','Course','Amount','Invoice','Status','Actions']}>
          {filtered.map(p => (
            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50">
              <td className="td font-medium text-navy-900 dark:text-white">{p.studentName}</td>
              <td className="td text-sm text-gray-500 dark:text-gray-400">{p.courseName}</td>
              <td className="td font-semibold">₹{p.amount}</td>
              <td className="td font-mono text-xs text-gray-400 dark:text-gray-500">{p.invoiceNumber}</td>
              <td className="td">
                <span className={`badge ${p.status==='paid'?'badge-green':p.status==='failed'?'badge-red':'badge-yellow'}`}>
                  {p.status}
                </span>
              </td>
              <td className="td">
                {p.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button onClick={() => approve(p.id)} className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg" title="Approve">
                      <CheckCircle size={17} />
                    </button>
                    <button onClick={() => reject(p.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Reject">
                      <XCircle size={17} />
                    </button>
                  </div>
                ) : p.status === 'paid' ? (
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"><Receipt size={13}/> Paid</span>
                ) : (
                  <span className="text-xs text-red-400">Rejected</span>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
