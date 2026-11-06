import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('recycearn-theme') === 'dark' } catch { return false }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('recycearn-theme', dark ? 'dark' : 'light') } catch {}
  }, [dark])

  return (
    <button
      type="button"
      onClick={() => setDark(value => !value)}
      className="theme-toggle"
      role="switch"
      aria-checked={dark}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      title={`Switch to ${dark ? 'light' : 'dark'} mode`}
    >
      <Sun size={15} className="theme-sun" />
      <span className="theme-track"><span className="theme-thumb" /></span>
      <Moon size={15} className="theme-moon" />
    </button>
  )
}
