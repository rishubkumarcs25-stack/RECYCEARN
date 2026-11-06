import { useState } from 'react'
import { Wallet, TrendingUp, Gift, ArrowDownCircle } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { REWARDS } from '../data/seed'
import { Btn, Card, Empty, Modal, PageHead, Stat, inp } from './ui'

export default function WalletView({ kind }) {
  const { db, me, A, balance, earned } = useStore()
  const pts = kind === 'points'
  const fmt = n => (pts ? `${n} pts` : `₹${n}`)
  const rows = db.tx.filter(t => t.userId === me.id && t.kind === kind).sort((a, b) => b.date.localeCompare(a.date))
  const [pick, setPick] = useState(null)
  const [amt, setAmt] = useState('')
  const bal = balance(me.id, kind)
  return (
    <div>
      <PageHead title={pts ? 'Rewards Wallet' : 'Agent Wallet'} sub={pts ? 'Earn points for every box you return.' : 'Your payouts for completed collections.'} />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat icon={Wallet} label={pts ? 'Current points' : 'Available balance'} value={fmt(bal)} />
        <Stat icon={TrendingUp} label={pts ? 'Total earned' : 'Total earnings'} value={fmt(earned(me.id, kind))} />
        <Stat icon={Gift} label="Transactions" value={rows.length} />
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2"><h3 className="font-semibold mb-3">Transaction history</h3>
          {!rows.length ? <Empty text="No transactions yet." /> : rows.map(t => (
            <div key={t.id} className="flex justify-between py-3 border-b last:border-0 text-sm"><div><p>{t.desc}</p><p className="text-xs text-gray-400">{t.date}</p></div>
              <span className={`font-semibold ${t.amount > 0 ? 'text-brand' : 'text-red-600'}`}>{t.amount > 0 ? '+' : '−'}{fmt(Math.abs(t.amount))}</span></div>))}</Card>
        <Card><h3 className="font-semibold mb-3">{pts ? 'Redeem rewards' : 'Withdraw to bank'}</h3>
          {pts ? REWARDS.map(r => (
            <div key={r.id} className="flex items-center justify-between py-2 text-sm"><div><p>{r.name}</p><p className="text-xs text-gray-400">{r.cost} pts</p></div>
              <Btn v="l" disabled={bal < r.cost} onClick={() => setPick(r)}>Redeem</Btn></div>))
            : <><input type="number" min="1" placeholder="Amount (₹)" className={inp} value={amt} onChange={e => setAmt(e.target.value)} />
              <Btn className="w-full mt-3" disabled={!(+amt > 0)} onClick={() => setPick({ name: 'Bank withdrawal', cost: +amt })}><ArrowDownCircle size={16} />Withdraw</Btn></>}
        </Card>
      </div>
      <Modal open={!!pick} title="Please confirm" onClose={() => setPick(null)}
        onOk={() => { A.spend(kind, pick.cost, pts ? 'Redeemed: ' + pick.name : 'Withdrawal to bank'); setAmt('') }}>
        {pick && (pts ? `Redeem “${pick.name}” for ${pick.cost} points?` : `Withdraw ₹${pick.cost} to your linked bank account?`)}
      </Modal>
    </div>
  )
}
