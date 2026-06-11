// components/Navbar.tsx

import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { label: 'Home',        icon: '🏠', path: '/'            },
  { label: 'Matches',     icon: '⚽', path: '/matches'     },
  { label: 'Leaderboard', icon: '🏆', path: '/leaderboard' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] bg-white border-t border-gray-100 flex items-center justify-around px-4 py-2 z-50"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {tabs.map(tab => {
        const active = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center gap-0.5 px-4 py-1"
          >
            <span className="text-2xl leading-none">{tab.icon}</span>
            <span
              className={`text-[11px] font-semibold transition-colors ${
                active ? 'text-black' : 'text-gray-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}