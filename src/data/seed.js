// Mock data. Replace with API calls (e.g. /api/collections) when the Express backend is ready.
export const AGENT_LOC = [12.9352, 77.6245]
// Per-unit rewards (pts) and agent payout (pay), plus the minimum quantity accepted per pickup.
export const SIZE_RATES = {
  'Small box': { pts: 5, pay: 5, min: 7 },
  'Medium box': { pts: 8, pay: 7, min: 5 },
  'Large box': { pts: 12, pay: 10, min: 3 },
  'Polythene': { pts: 3, pay: 2, min: 10 }
}
export const STATES = 'Andhra Pradesh,Assam,Bihar,Chhattisgarh,Delhi,Goa,Gujarat,Haryana,Himachal Pradesh,Jharkhand,Karnataka,Kerala,Madhya Pradesh,Maharashtra,Odisha,Punjab,Rajasthan,Tamil Nadu,Telangana,Uttar Pradesh,Uttarakhand,West Bengal'.split(',')
export const POLY = 'Polythene'
export const isPoly = i => i.size === POLY
// A pickup request holds one or two items: boxes ({ size, qty, condition }) and/or polythene, each with its own qty & condition.
export const itemLabel = i => (isPoly(i) ? 'Polythene' : i.size)
export const pack = c => c.items.map(i => `${itemLabel(i)} × ${i.qty}`).join(' + ')
export const totals = items => ({
  pay: items.reduce((t, i) => t + SIZE_RATES[i.size].pay * i.qty, 0),
  pts: items.reduce((t, i) => t + SIZE_RATES[i.size].pts * i.qty, 0)
})
export const REWARDS = [
  { id: 'r1', name: 'Amazon voucher ₹100', cost: 500 },
  { id: 'r2', name: 'Plant a tree in your name', cost: 200 },
  { id: 'r3', name: 'Myntra coupon ₹250', cost: 1000 },
  { id: 'r4', name: 'Reusable tote bag', cost: 350 }
]
export const km = (a, b) => {
  const r = x => (x * Math.PI) / 180
  const h = Math.sin(r(b[0] - a[0]) / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(r(b[1] - a[1]) / 2) ** 2
  return +(12742 * Math.asin(Math.sqrt(h))).toFixed(1)
}
const U = (id, name, email, role, extra = {}) => ({ id, name, email, role, password: 'demo123', phone: '+91 98450 1' + id.slice(-1) + '2345', active: true, joined: '2026-08-1' + id.slice(-1), ...extra })
// items: [[size, qty, condition], ...] — e.g. [['Medium box', 6, 'Good'], ['Polythene', 10, 'Damaged']]
const C = (id, orderId, customerId, address, addrType, lat, lng, items, status, agentId, date, slot) => {
  const its = items.map(([size, qty, condition]) => ({ size, qty, condition }))
  return { id, orderId, customerId, address, addrType, lat, lng, items: its, status, agentId, date, slot,
    ...totals(its), paid: ['Picked Up', 'Completed'].includes(status) }
}
const T = (id, userId, kind, amount, desc, ref, date) => ({ id, userId, kind, amount, desc, ref, date })

const ADDR_U1 = '14, 5th Block, Koramangala, Bengaluru, Karnataka – 560095'

export const seed = {
  session: null,
  users: [
    U('u1', 'Ananya Rao', 'customer@recycearn.in', 'customer'),
    U('u2', 'Rohit Mehta', 'rohit@mail.com', 'customer'),
    U('u3', 'Sneha Iyer', 'sneha@mail.com', 'customer'),
    U('u4', 'Karthik Nair', 'agent@recycearn.in', 'agent'),
    U('u5', 'Farah Khan', 'farah@mail.com', 'agent'),
    U('u6', 'Imran Sheikh', 'imran@mail.com', 'agent', { active: false }),
    U('u9', 'RecycEarn Admin', 'admin@recycearn.in', 'admin', { password: 'admin123' })
  ],
  collections: [
    C('k1', 'PL-1001', 'u1', ADDR_U1, 'Home', 12.9345, 77.619, [['Medium box', 6, 'Good']], 'Completed', 'u4', '2026-10-24', '10:00–12:00'),
    C('k2', 'PL-1002', 'u1', ADDR_U1, 'Home', 12.9345, 77.619, [['Large box', 4, 'Damaged']], 'Completed', 'u4', '2026-10-27', '14:00–16:00'),
    C('k3', 'PL-1003', 'u1', ADDR_U1, 'Home', 12.9345, 77.619, [['Small box', 10, 'Good'], ['Polythene', 10, 'Damaged']], 'Accepted', 'u4', '2026-10-31', '11:00–13:00'),
    C('k4', 'PL-1004', 'u1', ADDR_U1, 'Home', 12.9345, 77.619, [['Polythene', 10, 'Good']], 'Pending', null, '2026-11-02', '16:00–18:00'),
    C('k5', 'PL-1005', 'u2', '22, HSR Layout Sector 2, Bengaluru, Karnataka – 560102', 'Home', 12.9116, 77.6474, [['Large box', 3, 'Good']], 'Pending', null, '2026-10-31', '10:00–12:00'),
    C('k6', 'PL-1006', 'u3', '8, Indiranagar 12th Main, Bengaluru, Karnataka – 560038', 'Work', 12.9784, 77.6408, [['Small box', 7, 'Damaged']], 'Pending', null, '2026-11-01', '09:00–11:00'),
    C('k7', 'PL-1007', 'u2', '5, Jayanagar 4th Block, Bengaluru, Karnataka – 560011', 'Home', 12.9308, 77.5838, [['Medium box', 5, 'Good']], 'Picked Up', 'u5', '2026-10-30', '09:00–11:00'),
    C('k8', 'PL-1008', 'u3', '31, BTM Layout 2nd Stage, Bengaluru, Karnataka – 560076', 'Home', 12.9166, 77.6101, [['Medium box', 5, 'Good'], ['Polythene', 12, 'Good']], 'Pending', null, '2026-11-01', '13:00–15:00')
  ],
  tx: [
    T('t1', 'u1', 'points', 48, 'Reward for pickup PL-1001', 'k1-pts', '2026-10-24'),
    T('t2', 'u1', 'points', 48, 'Reward for pickup PL-1002', 'k2-pts', '2026-10-27'),
    T('t3', 'u1', 'points', 100, 'Welcome bonus', 'bonus-u1', '2026-08-12'),
    T('t4', 'u4', 'cash', 42, 'Payout for pickup PL-1001', 'k1-pay', '2026-10-24'),
    T('t5', 'u4', 'cash', 40, 'Payout for pickup PL-1002', 'k2-pay', '2026-10-27'),
    T('t6', 'u2', 'points', 40, 'Reward for pickup PL-1007', 'k7-pts', '2026-10-30'),
    T('t7', 'u5', 'cash', 35, 'Payout for pickup PL-1007', 'k7-pay', '2026-10-30')
  ],
  hubs: [
    { id: 'h1', name: 'Koramangala Micro-Hub', lat: 12.9279, lng: 77.6271, capacity: 400, stored: 286, status: 'Open' },
    { id: 'h2', name: 'Indiranagar Micro-Hub', lat: 12.9719, lng: 77.6412, capacity: 300, stored: 281, status: 'Open' },
    { id: 'h3', name: 'Jayanagar Micro-Hub', lat: 12.925, lng: 77.5938, capacity: 350, stored: 120, status: 'Open' },
    { id: 'h4', name: 'HSR Micro-Hub', lat: 12.9121, lng: 77.6446, capacity: 250, stored: 60, status: 'Maintenance' }
  ]
}
export const MONTHLY = [
  { m: 'May', collected: 420, reused: 290, recycled: 130 }, { m: 'Jun', collected: 610, reused: 430, recycled: 180 },
  { m: 'Jul', collected: 880, reused: 640, recycled: 240 }, { m: 'Aug', collected: 1120, reused: 810, recycled: 310 },
  { m: 'Sep', collected: 1490, reused: 1100, recycled: 390 }, { m: 'Oct', collected: 1860, reused: 1390, recycled: 470 }
]
export const PARTICIPATION = [
  { m: 'May', customers: 120, agents: 14 }, { m: 'Jun', customers: 210, agents: 22 }, { m: 'Jul', customers: 340, agents: 31 },
  { m: 'Aug', customers: 520, agents: 40 }, { m: 'Sep', customers: 760, agents: 52 }, { m: 'Oct', customers: 1040, agents: 63 }
]
export const WEEK_EARN = [{ d: 'Mon', e: 180 }, { d: 'Tue', e: 240 }, { d: 'Wed', e: 150 }, { d: 'Thu', e: 310 }, { d: 'Fri', e: 270 }, { d: 'Sat', e: 360 }, { d: 'Sun', e: 120 }]
