import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Recycle, User, Truck } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { Btn, Field, inp } from '../components/ui'
import ThemeToggle from '../components/ThemeToggle'

const DEMOS = [['Customer', 'customer@recycearn.in', 'demo123'], ['Agent', 'agent@recycearn.in', 'demo123'], ['Admin', 'admin@recycearn.in', 'admin123']]

export default function Auth({ mode }) {
  const { A } = useStore()
  const nav = useNavigate()
  const reg = mode === 'register'
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'customer' })
  const [err, setErr] = useState({})
  const set = k => e => setF({ ...f, [k]: e.target.value })

  const go = (r) => { if (typeof r === 'string') return setErr({ form: r }); A.toast(`Welcome, ${r.name.split(' ')[0]}!`); nav('/' + r.role) }
  const submit = e => {
    e.preventDefault()
    const er = {}
    if (reg && f.name.trim().length < 2) er.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address'
    if (f.password.length < 6) er.password = 'Password must be at least 6 characters'
    setErr(er)
    if (!Object.keys(er).length) go(reg ? A.register(f) : A.login(f.email, f.password))
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-forest text-white p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold"><Recycle className="text-lime" />RecycEarn</Link>
        <div><h2 className="text-4xl font-bold leading-tight">Every box deserves<br />a second life.</h2><p className="mt-4 text-emerald-100/80 max-w-md">Join neighbourhoods turning packaging waste into reusable resources.</p></div>
        <p className="text-sm text-emerald-200/60">© 2026 RecycEarn</p>
      </div>
      <div className="relative flex items-center justify-center p-6">
        <div className="absolute top-5 right-5"><ThemeToggle /></div>
        <form onSubmit={submit} className="w-full max-w-sm space-y-4 anim">
          <h1 className="text-2xl font-bold">{reg ? 'Create your account' : 'Welcome back'}</h1>
          {reg && <div className="grid grid-cols-2 gap-2">{[['customer', 'Customer', User], ['agent', 'Delivery Agent', Truck]].map(([r, l, I]) => (
            <button type="button" key={r} onClick={() => setF({ ...f, role: r })} className={`p-3 rounded-xl border text-sm flex flex-col items-center gap-1 transition ${f.role === r ? 'border-brand bg-lime/40 font-medium' : 'border-gray-200'}`}><I size={20} />{l}</button>))}</div>}
          {reg && <Field label="Full name" error={err.name}><input className={inp} value={f.name} onChange={set('name')} /></Field>}
          <Field label="Email" error={err.email}><input className={inp} value={f.email} onChange={set('email')} /></Field>
          <Field label="Password" error={err.password}><input type="password" className={inp} value={f.password} onChange={set('password')} /></Field>
          {err.form && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{err.form}</p>}
          <Btn className="w-full">{reg ? 'Create account' : 'Log in'}</Btn>
          <p className="text-sm text-center text-gray-500">{reg ? 'Already registered?' : 'New to RecycEarn?'} <Link className="text-forest font-medium" to={reg ? '/login' : '/register'}>{reg ? 'Log in' : 'Create account'}</Link></p>
          {!reg && <div className="border-t pt-4"><p className="text-xs text-gray-400 mb-2">Demo logins</p><div className="flex gap-2">{DEMOS.map(([l, e, p]) => (
            <Btn type="button" v="o" key={l} className="flex-1" onClick={() => go(A.login(e, p))}>{l}</Btn>))}</div></div>}
        </form>
      </div>
    </div>
  )
}
