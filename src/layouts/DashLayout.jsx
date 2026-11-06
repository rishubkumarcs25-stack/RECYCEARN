import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, PackagePlus, Boxes, Wallet, QrCode, ListChecks, MapPin, ScanLine, Users, Warehouse, BarChart3, LogOut, Menu, Recycle, RotateCcw } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { Btn, Modal } from '../components/ui'
import ThemeToggle from '../components/ThemeToggle'

const NAV = {
  customer: [['', 'Overview', LayoutDashboard], ['log', 'Log a Delivery', PackagePlus], ['collections', 'My Collections', Boxes], ['wallet', 'Rewards Wallet', Wallet], ['qr', 'QR Verification', QrCode]],
  agent: [['', 'Overview', LayoutDashboard], ['nearby', 'Nearby Tasks', MapPin], ['map', 'Route Map', MapPin], ['tasks', 'My Tasks', ListChecks], ['scanner', 'QR Scanner', ScanLine], ['wallet', 'Agent Wallet', Wallet]],
  admin: [['', 'Overview', LayoutDashboard], ['users', 'User Management', Users], ['collections', 'Collections', Boxes], ['hubs', 'Micro-Hubs', Warehouse], ['analytics', 'Analytics', BarChart3]]
}

export default function DashLayout() {
  const { me, A } = useStore()
  const [open, setOpen] = useState(false)
  const [out, setOut] = useState(false)
  const base = '/' + me.role
  return (
    <div className="min-h-screen flex">
      {open && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 h-screen w-64 bg-forest text-white flex flex-col p-4 z-40 transition-transform ${open ? '' : '-translate-x-full lg:translate-x-0'}`}>
        <Link to="/" className="flex items-center gap-2 text-xl font-bold px-2 py-3"><Recycle className="text-lime" />RecycEarn</Link>
        <p className="px-2 text-xs uppercase tracking-wider text-emerald-300/70 mb-2 capitalize">{me.role} workspace</p>
        <nav className="flex-1 space-y-1">{NAV[me.role].map(([p, label, I]) => (
          <NavLink key={p} end={p === ''} to={p ? `${base}/${p}` : base} onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${isActive ? 'bg-lime text-forest font-medium' : 'text-emerald-50/80 hover:bg-white/10'}`}><I size={18} />{label}</NavLink>))}</nav>
        <button onClick={() => A.resetDemo()} className="flex items-center gap-3 px-3 py-2 text-xs text-emerald-200/70 hover:text-white"><RotateCcw size={14} />Reset demo data</button>
        <button onClick={() => setOut(true)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-white/10"><LogOut size={18} />Log out</button>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu /></button><span className="hidden lg:block" />
          <div className="flex items-center gap-3"><ThemeToggle /><div className="text-right text-sm"><p className="font-medium">{me.name}</p><p className="text-xs text-gray-400 capitalize">{me.role}</p></div>
            <div className="w-9 h-9 rounded-full bg-lime text-forest font-bold flex items-center justify-center">{me.name[0]}</div></div>
        </header>
        <main className="p-4 lg:p-8 max-w-6xl anim"><Outlet /></main>
      </div>
      <Modal open={out} title="Log out?" onClose={() => setOut(false)} onOk={() => A.logout()} okText="Log out">You will need to sign in again to access your dashboard.</Modal>
    </div>
  )
}
