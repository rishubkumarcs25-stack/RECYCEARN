import { createContext, useContext, useEffect, useState } from 'react'
import { seed, totals } from '../data/seed'

const Ctx = createContext()
const KEY = 'recycearn_demo_v3'
export const useStore = () => useContext(Ctx)
const today = () => new Date().toISOString().slice(0, 10)
const mkTx = (userId, kind, amount, desc, ref) => ({ id: 't' + Math.random().toString(36).slice(2, 9), userId, kind, amount, desc, ref, date: today() })
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || seed } catch { return seed } }

export function StoreProvider({ children }) {
  const [db, setDb] = useState(load)
  const [toasts, setToasts] = useState([])
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(db)) }, [db])
  const me = db.users.find(u => u.id === db.session) || null

  const toast = (msg, type = 'ok') => {
    const id = Math.random()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200)
  }
  const balance = (uid, kind) => db.tx.filter(t => t.userId === uid && t.kind === kind).reduce((s, t) => s + t.amount, 0)
  const earned = (uid, kind) => db.tx.filter(t => t.userId === uid && t.kind === kind && t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const nameOf = id => db.users.find(u => u.id === id)?.name || '—'

  const A = {
    toast,
    login(email, password) {
      const u = db.users.find(u => u.email === email.trim().toLowerCase() && u.password === password)
      if (!u) return 'Invalid email or password'
      if (!u.active) return 'This account has been deactivated by an admin'
      setDb(d => ({ ...d, session: u.id })); return u
    },
    register(f) {
      const email = f.email.trim().toLowerCase()
      if (db.users.some(u => u.email === email)) return 'This email is already registered'
      const u = { id: 'u' + Date.now(), name: f.name.trim(), email, password: f.password, role: f.role, phone: '—', active: true, joined: today() }
      setDb(d => ({ ...d, users: [...d.users, u], session: u.id, tx: f.role === 'customer' ? [...d.tx, mkTx(u.id, 'points', 100, 'Welcome bonus', 'bonus-' + u.id)] : d.tx }))
      return u
    },
    logout() { setDb(d => ({ ...d, session: null })); toast('Signed out successfully') },
    logDelivery(f) {
      const items = f.items.map(i => ({ size: i.size, qty: +i.qty, condition: i.condition }))
      const k = { id: 'k' + Date.now(), orderId: 'PL-' + (1001 + db.collections.length), items,
        address: `${f.line}, ${f.city}, ${f.state} – ${f.pin}`, addrType: f.addrType, date: today(),
        customerId: me.id, status: 'Pending', agentId: null, slot: '10:00–12:00', ...totals(items), paid: false,
        lat: 12.93 + Math.random() * 0.05, lng: 77.59 + Math.random() * 0.06 }
      setDb(d => ({ ...d, collections: [k, ...d.collections] }))
      toast('Delivery logged — agents nearby can now accept it')
    },
    acceptTask(id) {
      const c = db.collections.find(x => x.id === id)
      if (!c || c.status !== 'Pending') return toast('Task is no longer available', 'err')
      setDb(d => ({ ...d, collections: d.collections.map(x => x.id === id ? { ...x, status: 'Accepted', agentId: me.id } : x) }))
      toast('Task accepted — it is now in My Tasks')
    },
    assignAgent(id, agentId) {
      setDb(d => ({ ...d, collections: d.collections.map(x => x.id === id ? { ...x, agentId, status: x.status === 'Pending' ? 'Accepted' : x.status } : x) }))
      toast('Agent assigned')
    },
    // Rewards + payout are credited exactly once per collection (guarded by `paid` flag and unique tx refs).
    verifyQR(id) {
      const c = db.collections.find(x => x.id === id)
      if (!c || c.paid || c.status !== 'Accepted') { toast('Already verified or not ready for pickup', 'err'); return false }
      setDb(d => {
        const cc = d.collections.find(x => x.id === id)
        if (cc.paid) return d
        const has = r => d.tx.some(t => t.ref === r)
        return { ...d,
          collections: d.collections.map(x => x.id === id ? { ...x, status: 'Picked Up', paid: true } : x),
          tx: [...d.tx,
            ...(has(id + '-pts') ? [] : [mkTx(c.customerId, 'points', c.pts, 'Reward for pickup ' + c.orderId, id + '-pts')]),
            ...(has(id + '-pay') ? [] : [mkTx(c.agentId, 'cash', c.pay, 'Payout for pickup ' + c.orderId, id + '-pay')])] }
      })
      toast(`QR verified — ${c.pts} pts to customer, ₹${c.pay} to agent`)
      return true
    },
    depositAtHub(id) {
      setDb(d => ({ ...d, collections: d.collections.map(x => x.id === id && x.status === 'Picked Up' ? { ...x, status: 'Completed' } : x),
        hubs: d.hubs.map((h, i) => i === 0 ? { ...h, stored: Math.min(h.capacity, h.stored + 1) } : h) }))
      toast('Deposited at micro-hub — task completed')
    },
    spend(kind, amount, desc) {
      if (balance(me.id, kind) < amount) return toast('Insufficient balance', 'err')
      setDb(d => ({ ...d, tx: [...d.tx, mkTx(me.id, kind, -amount, desc, 'spend-' + Date.now())] }))
      toast(kind === 'points' ? 'Reward redeemed!' : 'Withdrawal initiated')
    },
    toggleUser(id) { setDb(d => ({ ...d, users: d.users.map(u => u.id === id ? { ...u, active: !u.active } : u) })); toast('Account status updated') },
    toggleHub(id) { setDb(d => ({ ...d, hubs: d.hubs.map(h => h.id === id ? { ...h, status: h.status === 'Open' ? 'Maintenance' : 'Open' } : h) })); toast('Hub status updated') },
    resetDemo() { localStorage.removeItem(KEY); setDb(seed); toast('Demo data reset') }
  }
  return (
    <Ctx.Provider value={{ db, me, A, balance, earned, nameOf }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`anim px-4 py-3 rounded-xl shadow-lg text-sm text-white ${t.type === 'err' ? 'bg-red-600' : 'bg-forest'}`}>{t.msg}</div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
