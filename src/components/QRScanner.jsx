import { useEffect, useRef, useState } from 'react'
import { Camera, ScanLine, CheckCircle2 } from 'lucide-react'
import { Btn, Card, Empty, inp } from './ui'
import { useStore } from '../hooks/useStore'
import { pack } from '../data/seed'

// Camera preview (falls back to placeholder) + simulated verification for demos.
export default function QRScanner({ eligible }) {
  const { A } = useStore()
  const video = useRef(null)
  const stream = useRef(null)
  const [on, setOn] = useState(false)
  const [sel, setSel] = useState('')
  const [done, setDone] = useState(false)
  const id = eligible.some(c => c.id === sel) ? sel : eligible[0]?.id

  const start = async () => {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      video.current.srcObject = stream.current; setOn(true)
    } catch { A.toast('Camera unavailable — use the simulated scan', 'err') }
  }
  const stop = () => { stream.current?.getTracks().forEach(t => t.stop()); setOn(false) }
  useEffect(() => () => stream.current?.getTracks().forEach(t => t.stop()), [])
  const verify = () => { if (A.verifyQR(id)) { setDone(true); stop() } }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card>
        <div className="aspect-video rounded-xl bg-gray-900 relative overflow-hidden flex items-center justify-center text-gray-400">
          <video ref={video} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover ${on ? '' : 'hidden'}`} />
          {!on && <div className="text-center"><Camera className="mx-auto mb-2" />Camera preview</div>}
          <div className="absolute inset-8 border-2 border-brand rounded-xl pointer-events-none flex items-center justify-center"><ScanLine className="text-brand" size={36} /></div>
        </div>
        <div className="mt-4">{on ? <Btn v="o" onClick={stop}>Stop camera</Btn> : <Btn onClick={start}><Camera size={16} />Start camera</Btn>}</div>
      </Card>
      <Card>
        <h3 className="font-semibold mb-3">Verify exchange</h3>
        {done && <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm flex gap-2"><CheckCircle2 size={18} />Verified! Rewards and payout were credited once.</div>}
        {!eligible.length ? <Empty text="No collections are waiting for QR verification." /> : <>
          <select className={inp} value={id} onChange={e => { setSel(e.target.value); setDone(false) }}>{eligible.map(c => <option key={c.id} value={c.id}>{c.orderId} — {pack(c)}</option>)}</select>
          <Btn className="w-full mt-4" onClick={verify}><CheckCircle2 size={16} />Simulate scan &amp; verify</Btn>
          <p className="text-xs text-gray-400 mt-2">Demo mode: a production build would decode the QR from the camera feed.</p></>}
      </Card>
    </div>
  )
}
