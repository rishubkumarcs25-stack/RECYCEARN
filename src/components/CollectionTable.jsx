import { useStore } from '../hooks/useStore'
import { Badge, Empty, ItemLines } from './ui'

export default function CollectionTable({ rows, action, showCustomer }) {
  const { nameOf } = useStore()
  if (!rows.length) return <Empty text="No collections match your filters." />
  const heads = ['Ref', ...(showCustomer ? ['Customer'] : []), 'Packaging', 'Pickup address', 'Date', 'Points', 'Agent', 'Status', ...(action ? [''] : [])]
  return (
    <div className="overflow-x-auto"><table className="w-full text-sm">
      <thead><tr className="text-left text-gray-500 border-b">{heads.map(h => <th key={h} className="py-2 pr-4 font-medium">{h}</th>)}</tr></thead>
      <tbody>{rows.map(c => (
        <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
          <td className="py-3 pr-4"><p className="font-medium">{c.orderId}</p></td>
          {showCustomer && <td className="pr-4">{nameOf(c.customerId)}</td>}
          <td className="pr-4"><ItemLines c={c} /></td>
          <td className="pr-4 min-w-[180px]">{c.address}<p className="text-xs text-gray-400">{c.addrType}</p></td>
          <td className="pr-4 whitespace-nowrap">{c.date}<p className="text-xs text-gray-400">{c.slot}</p></td>
          <td className="pr-4">{c.pts}</td>
          <td className="pr-4">{c.agentId ? nameOf(c.agentId) : <span className="text-gray-400">Unassigned</span>}</td>
          <td className="pr-4"><Badge s={c.status} /></td>
          {action && <td>{action(c)}</td>}
        </tr>))}</tbody></table></div>
  )
}
