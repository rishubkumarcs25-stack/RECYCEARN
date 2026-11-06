import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Truck, CheckCircle2, IndianRupee, Clock, Gauge, MapPin, Search } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { AGENT_LOC, WEEK_EARN, km, pack } from '../data/seed'
import { Badge, Btn, Card, Chart, Empty, Modal, PageHead, Stat, Tabs, inp } from '../components/ui'
import QRScanner from '../components/QRScanner'

const useMine = () => { const { db, me } = useStore(); return db.collections.filter(c => c.agentId === me.id) }

export function Overview() {
  const { me, earned } = useStore()
  const m = useMine()
  const active = m.filter(c => c.status !== 'Completed')
  return (
    <div><PageHead title={`Hello, ${me.name.split(' ')[0]}`} sub="Your pickups for today." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Truck} label="Assigned pickups" value={active.length} />
        <Stat icon={CheckCircle2} label="Completed" value={m.filter(c => c.status === 'Completed').length} />
        <Stat icon={IndianRupee} label="Total earnings" value={`₹${earned(me.id, 'cash')}`} />
        <Stat icon={Clock} label="Pending pickups" value={m.filter(c => c.status === 'Accepted').length} />
      </div>
      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <Card className="lg:col-span-2"><h3 className="font-semibold mb-3">Earnings this week</h3><Chart><ResponsiveContainer><BarChart data={WEEK_EARN}><XAxis dataKey="d" /><YAxis /><Tooltip /><Bar dataKey="e" fill="#10B981" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Chart></Card>
        <Card className="text-center"><Gauge className="mx-auto text-brand" size={32} /><p className="text-4xl font-bold mt-2">91%</p><p className="text-sm text-gray-500">Route efficiency</p><p className="text-xs text-gray-400 mt-2">Pickups matched to your existing delivery route.</p></Card>
      </div></div>
  )
}

export function Nearby() {
  const { db, A } = useStore()
  const [q, setQ] = useState(''), [size, setSize] = useState('All'), [pick, setPick] = useState(null)
  const rows = db.collections.filter(c => c.status === 'Pending' && (size === 'All' || c.items.some(i => i.size === size)) && c.address.toLowerCase().includes(q.toLowerCase()))
    .map(c => ({ ...c, dist: km(AGENT_LOC, [c.lat, c.lng]) })).sort((a, b) => a.dist - b.dist)
  return (
    <div><PageHead title="Nearby Collection Tasks" sub="Sorted by distance from your location.">
      <div className="relative"><Search size={16} className="absolute left-3 top-2.5 text-gray-400" /><input className={inp + ' pl-9'} placeholder="Search area" value={q} onChange={e => setQ(e.target.value)} /></div></PageHead>
      <div className="mb-4"><Tabs items={['All', 'Small box', 'Medium box', 'Large box', 'Polythene']} value={size} onChange={setSize} /></div>
      {!rows.length ? <Card><Empty text="No open tasks right now. Check back soon." /></Card> : <div className="grid md:grid-cols-2 gap-4">{rows.map(c => (
        <Card key={c.id}><div className="flex justify-between"><div><p className="font-semibold">{c.address}</p><p className="text-xs text-gray-400">{c.orderId} · {c.date}, {c.slot}</p></div><span className="text-lg font-bold text-forest">₹{c.pay}</span></div>
          <div className="flex gap-2 items-center mt-3 text-sm text-gray-600"><MapPin size={14} />{c.dist} km<span>·</span>{pack(c)}</div>
          <div className="mt-2 flex gap-2 flex-wrap text-xs text-gray-500">{c.items.map((i, n) => <span key={n} className="inline-flex items-center gap-1">{i.size === 'Polythene' ? 'Polythene' : 'Boxes'}: <Badge s={i.condition} /></span>)}</div>
          <Btn className="w-full mt-4" onClick={() => setPick(c)}>Accept task</Btn></Card>))}</div>}
      <Modal open={!!pick} title="Accept this task?" onClose={() => setPick(null)} onOk={() => A.acceptTask(pick.id)}>{pick && `Collect ${pack(pick)} from ${pick.address} for ₹${pick.pay}.`}</Modal>
    </div>
  )
}

export function RouteMap() {
  const { db } = useStore()
  const m = useMine().filter(c => c.status === 'Accepted')
  const open = db.collections.filter(c => c.status === 'Pending')
  const hub = db.hubs.filter(h => h.status === 'Open').sort((a, b) => km(AGENT_LOC, [a.lat, a.lng]) - km(AGENT_LOC, [b.lat, b.lng]))[0]
  const route = [AGENT_LOC, ...m.map(c => [c.lat, c.lng]), ...(hub ? [[hub.lat, hub.lng]] : [])]
  return (
    <div><PageHead title="Route Map" sub="Blue: you · Green: open pickups · Dark: your accepted route · Lime: micro-hubs." />
      <Card className="p-2 h-[520px]"><MapContainer center={AGENT_LOC} zoom={13} scrollWheelZoom>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CircleMarker center={AGENT_LOC} radius={10} pathOptions={{ color: '#2563eb', fillOpacity: 0.9 }}><Popup>You are here</Popup></CircleMarker>
        {open.map(c => <CircleMarker key={c.id} center={[c.lat, c.lng]} radius={8} pathOptions={{ color: '#10B981', fillOpacity: 0.8 }}><Popup>{c.address}<br />{pack(c)} · ₹{c.pay}</Popup></CircleMarker>)}
        {m.map(c => <CircleMarker key={c.id} center={[c.lat, c.lng]} radius={8} pathOptions={{ color: '#14532D', fillOpacity: 0.9 }}><Popup>Accepted: {c.address}</Popup></CircleMarker>)}
        {db.hubs.map(h => <CircleMarker key={h.id} center={[h.lat, h.lng]} radius={9} pathOptions={{ color: '#65a30d', fillColor: '#D9F99D', fillOpacity: 1 }}><Popup>{h.name}<br />{h.stored}/{h.capacity} · {h.status}</Popup></CircleMarker>)}
        {route.length > 1 && <Polyline positions={route} pathOptions={{ color: '#14532D', dashArray: '6 8', weight: 4 }} />}
      </MapContainer></Card></div>
  )
}

export function MyTasks() {
  const { A, nameOf } = useStore()
  const m = useMine()
  const [t, setT] = useState('Accepted')
  const map = { Accepted: 'Accepted', 'In progress': 'Picked Up', Completed: 'Completed' }
  const rows = m.filter(c => c.status === map[t])
  return (
    <div><PageHead title="My Tasks" sub="Update each task as you progress." />
      <div className="mb-4"><Tabs items={Object.keys(map)} value={t} onChange={setT} /></div>
      {!rows.length ? <Card><Empty text={`No ${t.toLowerCase()} tasks.`} /></Card> : <div className="grid md:grid-cols-2 gap-4">{rows.map(c => (
        <Card key={c.id}><div className="flex justify-between"><div><p className="font-semibold">{c.address}</p><p className="text-xs text-gray-400">{c.orderId} · {nameOf(c.customerId)}</p></div><Badge s={c.status} /></div>
          <p className="text-sm text-gray-600 mt-3">{pack(c)} · {c.date}, {c.slot} · <b>₹{c.pay}</b></p>
          {c.status === 'Accepted' && <Link to="/agent/scanner"><Btn className="w-full mt-4">Scan QR to pick up</Btn></Link>}
          {c.status === 'Picked Up' && <Btn className="w-full mt-4" onClick={() => A.depositAtHub(c.id)}>Mark deposited at hub</Btn>}</Card>))}</div>}
    </div>
  )
}

export function Scanner() {
  const m = useMine().filter(c => c.status === 'Accepted')
  return <div><PageHead title="QR Scanner" sub="Scan the customer’s code to confirm the handover." /><QRScanner eligible={m} /></div>
}
