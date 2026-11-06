import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from '../hooks/useStore'
import DashLayout from '../layouts/DashLayout'
import Landing from '../pages/Landing'
import Auth from '../pages/Auth'
import * as C from '../dashboards/Customer'
import * as G from '../dashboards/Agent'
import * as M from '../dashboards/Admin'
import WalletView from '../components/WalletView'

const Protected = ({ role }) => {
  const { me } = useStore()
  return me?.role === role ? <DashLayout /> : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route path="/customer" element={<Protected role="customer" />}>
        <Route index element={<C.Overview />} /><Route path="log" element={<C.LogDelivery />} /><Route path="collections" element={<C.Collections />} />
        <Route path="wallet" element={<WalletView kind="points" />} /><Route path="qr" element={<C.QRPage />} />
      </Route>
      <Route path="/agent" element={<Protected role="agent" />}>
        <Route index element={<G.Overview />} /><Route path="nearby" element={<G.Nearby />} /><Route path="map" element={<G.RouteMap />} />
        <Route path="tasks" element={<G.MyTasks />} /><Route path="scanner" element={<G.Scanner />} /><Route path="wallet" element={<WalletView kind="cash" />} />
      </Route>
      <Route path="/admin" element={<Protected role="admin" />}>
        <Route index element={<M.Overview />} /><Route path="users" element={<M.Users />} /><Route path="collections" element={<M.Collections />} />
        <Route path="hubs" element={<M.Hubs />} /><Route path="analytics" element={<M.Analytics />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
