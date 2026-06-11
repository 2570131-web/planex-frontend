// src/components/ui/index.jsx — Complete shared UI component kit

import { X, Search, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

/* ── Modal ─────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/75 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 animate-fade-in max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/8 shrink-0">
          <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ── Spinner ────────────────────────────────────────── */
export function Spinner({ size = 20, className = '' }) {
  return (
    <span className={`inline-block rounded-full border-2 border-current border-t-transparent animate-spin ${className}`}
      style={{ width: size, height: size }} />
  );
}

/* ── Empty State ────────────────────────────────────── */
export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display font-bold text-xl text-navy-900 dark:text-white mb-2">{title}</h3>
      {description && <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  );
}

/* ── Stat Card ──────────────────────────────────────── */
export function StatCard({ icon, label, value, sub, color = 'gold' }) {
  const bg = {
    gold: 'bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
  };
  return (
    <div className="stat-card">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${bg[color]}`}>{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-display font-black text-2xl text-navy-900 dark:text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Confirm Dialog ─────────────────────────────────── */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading, danger = true }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex gap-3 mb-5">
        {danger && <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />}
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-ghost text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/20">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className={danger ? 'btn-danger' : 'btn-gold'}>
          {loading ? <Spinner size={16} /> : 'Confirm'}
        </button>
      </div>
    </Modal>
  );
}

/* ── Page Header ────────────────────────────────────── */
export function PageHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between mb-7 gap-4 flex-wrap">
      <div>
        <h1 className="font-display font-black text-2xl text-navy-900 dark:text-white">{title}</h1>
        {description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ── Search Input ───────────────────────────────────── */
export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="input pl-9 py-2 text-sm max-w-xs" />
    </div>
  );
}

/* ── Progress Bar ───────────────────────────────────── */
export function ProgressBar({ value, max = 100, color = 'gold', height = 6, showLabel = false }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colors = { gold: 'from-gold-400 to-gold-500', green: 'from-green-400 to-green-500', blue: 'from-blue-400 to-blue-500', red: 'from-red-400 to-red-500' };
  return (
    <div>
      {showLabel && <div className="flex justify-between text-xs mb-1"><span className="text-gray-500 dark:text-gray-400">{value}/{max}</span><span className="font-bold text-navy-900 dark:text-white">{pct}%</span></div>}
      <div className="bg-gray-100 dark:bg-navy-800 rounded-full overflow-hidden" style={{ height }}>
        <div className={`h-full rounded-full bg-gradient-to-r ${colors[color]} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── Table Wrapper ──────────────────────────────────── */
export function Table({ headers, children, empty }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-navy-800/80">
            <tr>{headers.map(h => <th key={h} className="th">{h}</th>)}</tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
        {empty}
      </div>
    </div>
  );
}
