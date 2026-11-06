import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Users as UsersIcon, Truck, Package, Activity, Coins, Recycle, Search } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { MONTHLY, PARTICIPATION } from '../data/seed'
import { Badge, Btn, Card, Chart, Empty, Modal, PageHead, Stat, Tabs, inp } from '../components/ui'
import CollectionTable from '../components/CollectionTable'

const COLORS = ['#10B981', '#14532D']
const reuse = [{ name: 'Reused', value: 6190 }, { name: 'Recycled', value: 1990 }]

export function Overview() {
  const { db } = useStore()
  const pts = db.tx.filter(t => t.kind === 'points' && t.amount > 0).reduce((s, t) => s + t.amount, 0)
  return (
    <div><PageHead title="Admin Overview" sub="Platform health at a glance." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat icon={UsersIcon} label="Registered customers" value={db.users.filter(u => u.role === 'customer').length} />
        <Stat icon={Truck} label="Delivery agents" value={db.users.filter(u => u.role === 'agent').length} />
        <Stat icon={Package} label="Packages collected" value={db.collections.filter(c => c.paid).length + 8160} sub="incl. historical" />
        <Stat icon={Activity} label="Active requests" value={db.collections.filter(c => ['Pending', 'Accepted', 'Picked Up'].includes(c.status)).length} />
        <Stat icon={Coins} label="Points distributed" value={pts} />
        <Stat icon={Recycle} label="Reuse rate" value="76%" sub="of collected boxes" />
      </div>
      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        <Card><h3 className="font-semibold mb-3">Monthly collection</h3><Chart><ResponsiveContainer><BarChart data={MONTHLY}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="m" /><YAxis /><Tooltip /><Bar dataKey="collected" fill="#10B981" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Chart></Card>
        <Card><h3 className="font-semibold mb-3">Reuse vs recycling</h3><Chart><ResponsiveContainer><PieChart><Pie data={reuse} dataKey="value" innerRadius={55} outerRadius={85} label>{reuse.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Legend /><Tooltip /></PieChart></ResponsiveContainer></Chart></Card>
      </div></div>
  )
}

export function Users() {
  const { db, A } = useStore()
  const [role, setRole] = useState('customer'), [q, setQ] = useState(''), [view, setView] = useState(null), [tog, setTog] = useState(null)
  const rows = db.users.filter(u => u.role === role && (u.name + u.email).toLowerCase().includes(q.toLowerCase()))
  return (
    <div><PageHead title="User Management">
      <div className="relative"><Search size={16} className="absolute left-3 top-2.5 text-gray-400" /><input className={inp + ' pl-9'} placeholder="Search users" value={q} onChange={e => setQ(e.target.value)} /></div></PageHead>
      <Card><div className="mb-4"><Tabs items={['customer', 'agent']} value={role} onChange={setRole} /></div>
        {!rows.length ? <Empty text="No users found." /> : <div className="overflow-x-auto"><table className="w-full text-sm"><tbody>{rows.map(u => (
          <tr key={u.id} className="border-b last:border-0"><td className="py-3"><p className="font-medium">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></td><td>{u.joined}</td><td><Badge s={u.active ? 'Active' : 'Inactive'} /></td>
            <td className="text-right space-x-2"><Btn v="o" onClick={() => setView(u)}>Details</Btn><Btn v={u.active ? 'd' : 'l'} onClick={() => setTog(u)}>{u.active ? 'Deactivate' : 'Activate'}</Btn></td></tr>))}</tbody></table></div>}</Card>
      <Modal open={!!view} title={view?.name} onClose={() => setView(null)}>{view && <div className="space-y-1"><p>Email: {view.email}</p><p>Phone: {view.phone}</p><p>Role: {view.role}</p><p>Joined: {view.joined}</p></div>}</Modal>
      <Modal open={!!tog} title="Change account status?" onClose={() => setTog(null)} onOk={() => A.toggleUser(tog.id)}>{tog && `${tog.active ? 'Deactivate' : 'Activate'} ${tog.name}'s account?`}</Modal>
    </div>
  )
}

export function Collections() {
  const { db, A } = useStore()
  const [s, setS] = useState('All'), [from, setFrom] = useState('')
  const agents = db.users.filter(u => u.role === 'agent' && u.active)
  const rows = db.collections.filter(c => (s === 'All' || c.status === s) && (!from || c.date >= from))
  return (
    <div><PageHead title="Collection Management" sub="Monitor and assign every request." />
      <Card><div className="flex flex-wrap gap-3 mb-4 justify-between"><Tabs items={['All', 'Pending', 'Accepted', 'Picked Up', 'Completed']} value={s} onChange={setS} />
        <input type="date" className={inp + ' w-auto'} value={from} onChange={e => setFrom(e.target.value)} title="From date" /></div>
        <CollectionTable showCustomer rows={rows} action={c => c.status === 'Pending' || c.status === 'Accepted' ? (
          <select className={inp + ' w-36'} value={c.agentId || ''} onChange={e => e.target.value && A.assignAgent(c.id, e.target.value)}><option value="">Assign agent…</option>{agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>) : null} /></Card></div>
  )
}

export function Hubs() {
  const { db, A } = useStore()
  return (
    <div><PageHead title="Micro-Hub Management" sub="Neighbourhood drop-off and sorting points." />
      <div className="grid md:grid-cols-2 gap-4">{db.hubs.map(h => { const p = Math.round((h.stored / h.capacity) * 100); return (
        <Card key={h.id}><div className="flex justify-between"><h3 className="font-semibold">{h.name}</h3><Badge s={h.status} /></div>
          <p className="text-sm text-gray-500 mt-2">{h.stored} of {h.capacity} boxes stored ({p}%)</p>
          <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden"><div className={`h-full rounded-full ${p > 90 ? 'bg-red-500' : 'bg-brand'}`} style={{ width: p + '%' }} /></div>
          {p > 90 && <p className="text-xs text-red-600 mt-1">Near capacity — schedule a transfer.</p>}
          <Btn v="o" className="mt-4" onClick={() => A.toggleHub(h.id)}>{h.status === 'Open' ? 'Set to maintenance' : 'Reopen hub'}</Btn></Card>) })}</div></div>
  )
}

export function Analytics() {
  const { db, nameOf } = useStore()
  const perf = db.users.filter(u => u.role === 'agent').map(u => ({ name: u.name.split(' ')[0], tasks: db.collections.filter(c => c.agentId === u.id && c.paid).length }))
  return (
    <div><PageHead title="Analytics" />
      <div className="grid lg:grid-cols-2 gap-5">
        <Card><h3 className="font-semibold mb-3">Monthly packaging collection</h3><Chart><ResponsiveContainer><BarChart data={MONTHLY}><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="reused" stackId="a" fill="#10B981" /><Bar dataKey="recycled" stackId="a" fill="#14532D" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Chart></Card>
        <Card><h3 className="font-semibold mb-3">Reuse versus recycling</h3><Chart><ResponsiveContainer><PieChart><Pie data={reuse} dataKey="value" outerRadius={85} label>{reuse.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Legend /><Tooltip /></PieChart></ResponsiveContainer></Chart></Card>
        <Card><h3 className="font-semibold mb-3">Customer participation</h3><Chart><ResponsiveContainer><LineChart data={PARTICIPATION}><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Line dataKey="customers" stroke="#10B981" strokeWidth={3} /><Line dataKey="agents" stroke="#14532D" strokeWidth={3} /></LineChart></ResponsiveContainer></Chart></Card>
        <Card><h3 className="font-semibold mb-3">Agent performance (verified pickups)</h3><Chart><ResponsiveContainer><BarChart data={perf}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="tasks" fill="#14532D" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Chart></Card>
      </div></div>
  )
}
