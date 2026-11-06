import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Package, Coins, Leaf, Recycle, Search } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { Badge, Btn, Card, Empty, Field, PageHead, Stat, Tabs, inp } from '../components/ui'
import CollectionTable from '../components/CollectionTable'
import QRScanner from '../components/QRScanner'
import { SIZE_RATES, STATES, POLY, isPoly, pack } from '../data/seed'

const mine = (db, me) => db.collections.filter(c => c.customerId === me.id)

export function Overview() {
  const { db, me, balance, nameOf } = useStore()
  const all = mine(db, me)
  const done = all.filter(c => ['Picked Up', 'Completed'].includes(c.status))
  const boxes = (cs, good) => cs.flatMap(c => c.items).filter(i => !isPoly(i) && (!good || i.condition === 'Good')).reduce((t, i) => t + i.qty, 0)
  const kg = (boxes(done) * 0.45).toFixed(1)
  const up = all.filter(c => ['Pending', 'Accepted'].includes(c.status)).sort((a, b) => a.date.localeCompare(b.date))
  return (
    <div>
      <PageHead title={`Welcome back, ${me.name.split(' ')[0]}`} sub="Here’s how your packaging is doing." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Package} label="Packages returned" value={done.length} />
        <Stat icon={Coins} label="Reward points" value={balance(me.id, 'points')} />
        <Stat icon={Leaf} label="Cardboard saved" value={`${kg} kg`} sub="≈ 0.45 kg per box" />
        <Stat icon={Recycle} label="Boxes reused" value={boxes(done, true)} />
      </div>
      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        <Card><h3 className="font-semibold mb-3">Recent collection activity</h3>
          {!done.length ? <Empty text="No completed pickups yet." /> : done.map(c => (
            <div key={c.id} className="flex justify-between py-2.5 border-b last:border-0 text-sm"><div><p className="font-medium">{c.orderId}</p><p className="text-xs text-gray-400">{c.date} · {nameOf(c.agentId)}</p></div><span className="text-brand font-medium">+{c.pts} pts</span></div>))}</Card>
        <Card><h3 className="font-semibold mb-3">Upcoming deliveries</h3>
          {!up.length ? <Empty text="No upcoming deliveries. Log one to get started." /> : up.map(c => (
            <div key={c.id} className="flex justify-between items-center py-2.5 border-b last:border-0 text-sm"><div><p className="font-medium">{c.orderId}</p><p className="text-xs text-gray-400">{pack(c)} · {c.date}</p></div><Badge s={c.status} /></div>))}</Card>
      </div>
    </div>
  )
}

export function LogDelivery() {
  const { A } = useStore()
  const nav = useNavigate()
  const init = { type: 'Boxes', size: 'Medium box', boxQty: SIZE_RATES['Medium box'].min, boxCond: 'Good', polyQty: SIZE_RATES[POLY].min, polyCond: 'Good',
    state: 'Karnataka', city: '', pin: '', addrType: 'Home', line: '' }
  const [f, setF] = useState(init)
  const [er, setEr] = useState({})
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const withBoxes = f.type !== 'Polythene', withPoly = f.type !== 'Boxes'
  const boxMin = SIZE_RATES[f.size].min, polyMin = SIZE_RATES[POLY].min
  const chSize = e => { const size = e.target.value; setF({ ...f, size, boxQty: SIZE_RATES[size].min }); setEr({}) }
  const submit = e => {
    e.preventDefault()
    const x = {}, bq = parseInt(f.boxQty, 10), pq = parseInt(f.polyQty, 10)
    if (withBoxes && !(bq >= boxMin)) x.boxQty = `Minimum quantity is ${boxMin}`
    if (withPoly && !(pq >= polyMin)) x.polyQty = `Minimum quantity is ${polyMin}`
    if (f.city.trim().length < 2) x.city = 'Enter your city'
    if (!/^\d{6}$/.test(f.pin.trim())) x.pin = 'Enter a valid 6-digit pincode'
    if (f.line.trim().length < 8) x.line = 'Enter your full address line'
    setEr(x)
    if (Object.keys(x).length) return
    const items = [...(withBoxes ? [{ size: f.size, qty: bq, condition: f.boxCond }] : []), ...(withPoly ? [{ size: POLY, qty: pq, condition: f.polyCond }] : [])]
    A.logDelivery({ items, state: f.state, addrType: f.addrType, city: f.city.trim(), pin: f.pin.trim(), line: f.line.trim() }); nav('/customer/collections')
  }
  return (
    <div><PageHead title="Log a Delivery" sub="Tell us what’s arriving and we’ll arrange a pickup." />
      <Card className="max-w-2xl"><form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><p className="text-sm font-medium mb-1">Packaging type</p><Tabs items={['Boxes', 'Polythene', 'Both']} value={f.type} onChange={t => { setF({ ...f, type: t }); setEr({}) }} />
          <p className="text-xs text-gray-400 mt-1">Choose both to hand over boxes and polythene in a single pickup.</p></div>
        {withBoxes && <div className="sm:col-span-2 rounded-xl border border-gray-100 bg-gray-50/60 p-4 grid sm:grid-cols-2 gap-4">
          <h3 className="sm:col-span-2 font-semibold">Boxes</h3>
          <Field label="Box size"><select className={inp} value={f.size} onChange={chSize}>{['Small box', 'Medium box', 'Large box'].map(p => <option key={p}>{p}</option>)}</select></Field>
          <Field label="Box condition"><select className={inp} value={f.boxCond} onChange={set('boxCond')}>{['Good', 'Damaged'].map(p => <option key={p}>{p}</option>)}</select></Field>
          <div className="sm:col-span-2"><Field label="Box quantity" error={er.boxQty}><input type="number" min={boxMin} className={inp + ' max-w-[160px]'} value={f.boxQty} onChange={set('boxQty')} /></Field>
            <p className="text-xs text-gray-400 mt-1">Minimum {boxMin} {f.size.toLowerCase()}es per pickup · {SIZE_RATES[f.size].pts} pts each</p></div>
        </div>}
        {withPoly && <div className="sm:col-span-2 rounded-xl border border-gray-100 bg-gray-50/60 p-4 grid sm:grid-cols-2 gap-4">
          <h3 className="sm:col-span-2 font-semibold">Polythene</h3>
          <Field label="Polythene kind"><input className={inp} value="Polythene (covers / bubble wrap)" readOnly /></Field>
          <Field label="Polythene condition"><select className={inp} value={f.polyCond} onChange={set('polyCond')}>{['Good', 'Damaged'].map(p => <option key={p}>{p}</option>)}</select></Field>
          <div className="sm:col-span-2"><Field label="Polythene quantity" error={er.polyQty}><input type="number" min={polyMin} className={inp + ' max-w-[160px]'} value={f.polyQty} onChange={set('polyQty')} /></Field>
            <p className="text-xs text-gray-400 mt-1">Minimum {polyMin} polythene pieces per pickup · {SIZE_RATES[POLY].pts} pts each</p></div>
        </div>}
        <h3 className="sm:col-span-2 font-semibold mt-2">Pickup address</h3>
        <Field label="State"><select className={inp} value={f.state} onChange={set('state')}>{STATES.map(p => <option key={p}>{p}</option>)}</select></Field>
        <Field label="City" error={er.city}><input className={inp} value={f.city} onChange={set('city')} placeholder="e.g. Bengaluru" /></Field>
        <Field label="Pincode" error={er.pin}><input className={inp} inputMode="numeric" maxLength={6} value={f.pin} onChange={set('pin')} placeholder="6 digits" /></Field>
        <div><Field label="Address type"><select className={inp} value={f.addrType} onChange={set('addrType')}>{['Home', 'Work', 'Other'].map(p => <option key={p}>{p}</option>)}</select></Field>
          <p className="text-xs text-gray-400 mt-1">Helps the delivery partner find you</p></div>
        <div className="sm:col-span-2"><Field label="Address line" error={er.line}><textarea rows={2} className={inp} value={f.line} onChange={set('line')} placeholder="House/flat no., street, area, landmark" /></Field></div>
        <div className="sm:col-span-2 flex justify-end"><Btn>Submit pickup request</Btn></div></form></Card></div>
  )
}

export function Collections() {
  const { db, me } = useStore()
  const [q, setQ] = useState(''), [s, setS] = useState('All')
  const rows = mine(db, me).filter(c => (s === 'All' || c.status === s) && c.orderId.toLowerCase().includes(q.toLowerCase()))
  return (
    <div><PageHead title="My Collections" sub="Track every pickup request." />
      <Card><div className="flex flex-wrap gap-3 mb-4 justify-between"><Tabs items={['All', 'Pending', 'Accepted', 'Picked Up', 'Completed']} value={s} onChange={setS} />
        <div className="relative"><Search size={16} className="absolute left-3 top-2.5 text-gray-400" /><input className={inp + ' pl-9'} placeholder="Search ref" value={q} onChange={e => setQ(e.target.value)} /></div></div>
        <CollectionTable rows={rows} /></Card></div>
  )
}

export function QRPage() {
  const { db, me } = useStore()
  const list = mine(db, me).filter(c => c.status !== 'Pending')
  const [sel, setSel] = useState('')
  const c = list.find(x => x.id === sel) || list.find(x => x.status === 'Accepted') || list[0]
  return (
    <div><PageHead title="QR Verification" sub="Show this code to your agent at handover." />
      {!c ? <Card><Empty text="Once an agent accepts a pickup, your QR code appears here." /></Card> : <>
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          <Card className="text-center"><select className={inp + ' mb-4'} value={c.id} onChange={e => setSel(e.target.value)}>{list.map(x => <option key={x.id} value={x.id}>{x.orderId}</option>)}</select>
            <div className="inline-block p-4 rounded-2xl border bg-white"><QRCodeSVG value={`recycearn:${c.id}:${c.orderId}`} size={190} fgColor="#14532D" /></div>
            <p className="mt-3 font-medium">{c.orderId}</p><div className="mt-2"><Badge s={c.paid ? 'Completed' : 'Pending'} /> <span className="text-sm text-gray-500 ml-1">{c.paid ? 'QR verified' : 'Awaiting verification'}</span></div></Card>
          <Card><h3 className="font-semibold mb-2">How it works</h3><ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5"><li>Hand over your flattened box.</li><li>The agent scans this code.</li><li>You instantly earn <b>{c.pts} points</b>.</li></ol></Card></div>
        <h3 className="font-semibold mb-3">Scan to confirm exchange</h3>
        <QRScanner eligible={list.filter(x => x.status === 'Accepted')} /></>}
    </div>
  )
}
