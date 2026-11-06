import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { Recycle, UserPlus, Truck, MapPin, QrCode, Coins, Warehouse, Repeat, Leaf, Wallet, Briefcase, Home, Mail, Github, Twitter, Linkedin } from 'lucide-react'

const STEPS = [[UserPlus, 'Register & log', 'Customers log upcoming e-commerce deliveries.'], [MapPin, 'Match routes', 'Nearby agents see tasks on their existing routes.'],
  [Truck, 'Doorstep pickup', 'Agents collect pre-flattened cardboard boxes.'], [QrCode, 'QR verification', 'A QR scan confirms every exchange.'],
  [Coins, 'Get rewarded', 'Points for customers, cash for agents.'], [Warehouse, 'Hub & reuse', 'Intact boxes are reused, damaged ones recycled.']]
const WHY = [[Home, 'Convenience', 'Doorstep pickup, no trips to drop-off centres.'], [Wallet, 'Real rewards', 'Redeem points for vouchers and eco gifts.'],
  [Briefcase, 'Local income', 'Agents earn extra on routes they already ride.'], [Leaf, 'Sustainability', 'Fewer new boxes, less landfill, lower emissions.']]
const STATS = [['1.86L+', 'Packages collected'], ['74%', 'Cardboard reused'], ['1,040', 'Agents & customers joined'], ['92 t', 'Waste diverted']]

const Hero = () => (
  <svg viewBox="0 0 480 360" className="w-full max-w-lg mx-auto">
    <rect x="20" y="40" width="440" height="280" rx="32" fill="#D9F99D" opacity=".5" />
    <path d="M0 300 H480" stroke="#14532D" strokeWidth="4" strokeLinecap="round" />
    <rect x="70" y="190" width="180" height="100" rx="10" fill="#14532D" /><path d="M250 215 h60 l35 40 v35 h-95z" fill="#10B981" />
    <circle cx="120" cy="300" r="22" fill="#1F2937" /><circle cx="300" cy="300" r="22" fill="#1F2937" /><circle cx="120" cy="300" r="9" fill="#fff" /><circle cx="300" cy="300" r="9" fill="#fff" />
    {[[90, 130], [150, 150], [120, 98]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width="54" height={i === 2 ? 36 : 40} rx="4" fill="#D9F99D" stroke="#14532D" strokeWidth="3" /><path d={`M${x + 27} ${y}v${i === 2 ? 36 : 40}`} stroke="#14532D" strokeWidth="3" /></g>)}
    <g transform="translate(360 70)"><circle r="34" fill="#fff" /><path d="M-12 4 a14 14 0 0 1 24 -8 M12 -4 a14 14 0 0 1 -24 8" stroke="#10B981" strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M14 -12 v10 h-10 M-14 12 v-10 h10" stroke="#10B981" strokeWidth="5" fill="none" strokeLinecap="round" /></g>
  </svg>
)

export default function Landing() {
  return (
    <div>
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 font-bold text-xl text-forest"><Recycle className="text-brand" />RecycEarn</a>
          <div className="hidden md:flex gap-8 text-sm text-gray-600"><a href="#home">Home</a><a href="#how">How It Works</a><a href="#impact">Impact</a></div>
          <div className="flex items-center gap-2"><ThemeToggle /><Link to="/login" className="px-4 py-2 text-sm font-medium">Login</Link><Link to="/register" className="px-4 py-2 text-sm font-medium bg-forest text-white rounded-xl hover:bg-emerald-800 transition">Get Started</Link></div>
        </div>
      </nav>
      <section id="home" className="max-w-6xl mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div className="anim"><span className="text-xs font-medium bg-lime text-forest px-3 py-1 rounded-full">Reverse logistics for e-commerce packaging</span>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-forest mt-5 leading-tight">Your Packages Have a Second Life.</h1>
          <p className="mt-5 text-gray-600 text-lg">RecycEarn turns e-commerce packaging waste into reusable resources. Delivery agents collect flattened boxes on routes they already ride, neighbourhood micro-hubs sort them, and everyone gets rewarded.</p>
          <div className="flex flex-wrap gap-3 mt-8"><Link to="/register" className="px-6 py-3 rounded-xl bg-forest text-white font-medium hover:bg-emerald-800 transition">Start Returning</Link>
            <Link to="/register" className="px-6 py-3 rounded-xl border-2 border-forest text-forest font-medium hover:bg-lime/50 transition">Become a Collection Agent</Link></div></div>
        <Hero />
      </section>
      <section id="how" className="bg-white py-20"><div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">How it works</h2><p className="text-center text-gray-500 mt-2">Six simple steps from doorstep to second life.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">{STEPS.map(([I, t, d], i) => (
          <div key={t} className="p-6 rounded-2xl border bg-canvas hover:shadow-md hover:-translate-y-1 transition"><div className="flex items-center justify-between"><div className="p-3 rounded-xl bg-forest text-lime"><I size={22} /></div><span className="text-3xl font-bold text-gray-200">0{i + 1}</span></div>
            <h3 className="font-semibold mt-4">{t}</h3><p className="text-sm text-gray-500 mt-1">{d}</p></div>))}</div></div></section>
      <section className="max-w-6xl mx-auto px-4 py-20"><h2 className="text-3xl font-bold text-center">Why RecycEarn</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">{WHY.map(([I, t, d]) => (
          <div key={t} className="p-6 rounded-2xl bg-white border hover:shadow-md transition"><I className="text-brand" /><h3 className="font-semibold mt-3">{t}</h3><p className="text-sm text-gray-500 mt-1">{d}</p></div>))}</div></section>
      <section id="impact" className="bg-forest text-white py-16"><div className="max-w-6xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">{STATS.map(([n, l]) => (
        <div key={l}><p className="text-4xl font-extrabold text-lime">{n}</p><p className="text-emerald-100/80 text-sm mt-1">{l}</p></div>))}</div></section>
      <section className="max-w-4xl mx-auto px-4 py-20 text-center"><h2 className="text-3xl font-bold">Ready to close the loop?</h2><p className="text-gray-500 mt-2">Join as a customer to earn rewards, or as an agent to earn on every route.</p>
        <div className="flex justify-center flex-wrap gap-3 mt-6"><Link to="/register" className="px-6 py-3 rounded-xl bg-forest text-white font-medium">Join as Customer</Link><Link to="/register" className="px-6 py-3 rounded-xl bg-lime text-forest font-medium">Join as Agent</Link></div></section>
      <footer className="bg-ink text-gray-300 py-10"><div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-between gap-6 text-sm">
        <div><p className="flex items-center gap-2 text-white font-bold"><Recycle className="text-brand" />RecycEarn</p><p className="mt-2 max-w-xs">Decentralised reverse logistics for e-commerce packaging.</p></div>
        <div><p className="text-white font-medium mb-2">Company</p><a href="#home" className="block">About</a><a href="mailto:hello@recycearn.in" className="block">Contact</a></div>
        <div className="flex gap-4 items-start"><a href="mailto:hello@recycearn.in" aria-label="Email"><Mail /></a><a href="https://twitter.com" aria-label="Twitter"><Twitter /></a><a href="https://linkedin.com" aria-label="LinkedIn"><Linkedin /></a><a href="https://github.com" aria-label="GitHub"><Github /></a></div></div></footer>
    </div>
  )
}
