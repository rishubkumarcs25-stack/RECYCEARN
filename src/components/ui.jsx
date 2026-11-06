import { X, Inbox } from 'lucide-react'
import { itemLabel } from '../data/seed'

export const Card = ({ className = '', children }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition hover:shadow-md ${className}`}>{children}</div>
)
export const Btn = ({ v = 'p', className = '', ...p }) => (
  <button {...p} className={`px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50 inline-flex items-center justify-center gap-2 ${
    v === 'p' ? 'bg-forest text-white hover:bg-emerald-800' : v === 'o' ? 'border border-gray-200 bg-white hover:bg-gray-50' : v === 'l' ? 'bg-lime text-forest hover:brightness-95' : 'bg-red-50 text-red-700 hover:bg-red-100'} ${className}`} />
)
const tone = { Pending: 'bg-amber-100 text-amber-800', Accepted: 'bg-sky-100 text-sky-800', 'Picked Up': 'bg-violet-100 text-violet-800',
  Completed: 'bg-emerald-100 text-emerald-800', Active: 'bg-emerald-100 text-emerald-800', Inactive: 'bg-gray-200 text-gray-600',
  Open: 'bg-emerald-100 text-emerald-800', Maintenance: 'bg-amber-100 text-amber-800', Good: 'bg-emerald-100 text-emerald-800', Damaged: 'bg-red-100 text-red-700' }
export const Badge = ({ s }) => <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${tone[s] || 'bg-gray-100'}`}>{s}</span>
export const Stat = ({ icon: I, label, value, sub }) => (
  <Card className="anim"><div className="flex items-start justify-between"><div><p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>{sub && <p className="text-xs text-brand mt-1">{sub}</p>}</div>
    <div className="p-2.5 rounded-xl bg-lime text-forest"><I size={20} /></div></div></Card>
)
export const Empty = ({ text }) => (
  <div className="text-center py-10 text-gray-400"><Inbox className="mx-auto mb-2" />{text}</div>
)
export const PageHead = ({ title, sub, children }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-6"><div><h1 className="text-2xl font-bold">{title}</h1>
    {sub && <p className="text-gray-500 text-sm">{sub}</p>}</div>{children}</div>
)
export const Modal = ({ open, title, onClose, onOk, okText = 'Confirm', children }) => open ? (
  <div className="fixed inset-0 z-[9000] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl p-6 w-full max-w-md anim" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between mb-3"><h3 className="font-semibold text-lg">{title}</h3><button onClick={onClose}><X size={18} /></button></div>
      <div className="text-sm text-gray-600 mb-5">{children}</div>
      <div className="flex justify-end gap-2"><Btn v="o" onClick={onClose}>{onOk ? 'Cancel' : 'Close'}</Btn>{onOk && <Btn onClick={() => { onOk(); onClose() }}>{okText}</Btn>}</div>
    </div></div>) : null
export const Field = ({ label, error, children }) => (
  <label className="block"><span className="text-sm font-medium">{label}</span><div className="mt-1">{children}</div>
    {error && <span className="text-xs text-red-600">{error}</span>}</label>
)
export const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand'
export const Tabs = ({ items, value, onChange }) => (
  <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">{items.map(i => (
    <button type="button" key={i} onClick={() => onChange(i)} className={`px-3 py-1.5 rounded-lg text-sm ${value === i ? 'bg-white shadow font-medium' : 'text-gray-500'}`}>{i}</button>))}</div>
)
export const Chart = ({ children }) => <div className="h-64 w-full">{children}</div>

// One line per packaging item: "Medium box × 6" with its own condition badge.
export const ItemLines = ({ c }) => (
  <div className="space-y-1">{c.items.map((i, n) => (
    <div key={n} className="flex items-center gap-2 flex-wrap"><span>{itemLabel(i)} × {i.qty}</span><Badge s={i.condition} /></div>))}</div>
)
