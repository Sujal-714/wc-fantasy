// pages/SelectReplacement.tsx

import { useLocation, useNavigate } from 'react-router-dom'
import PitchPlayerCard from '../components/PitchPlayerCard'

type Position = 'FWD' | 'MID' | 'DEF' | 'GK'

interface Player {
  id: number
  name: string
  position: Position
  country: string
  price: number
}

// Mock current squad — replace with real context/state later
const MOCK_SQUAD: Player[] = [
  { id: 1,  name: 'C. Ronaldo',   position: 'FWD', country: 'PT', price: 12 },
  { id: 2,  name: 'K. Mbappé',    position: 'FWD', country: 'FR', price: 13 },
  { id: 3,  name: 'H. Kane',      position: 'FWD', country: 'EN', price: 11 },
  { id: 4,  name: 'K. De Bruyne', position: 'MID', country: 'BE', price: 12 },
  { id: 5,  name: 'L. Modric',    position: 'MID', country: 'HR', price: 10 },
  { id: 6,  name: 'B. Fernandes', position: 'MID', country: 'PT', price: 10 },
  { id: 7,  name: 'P. Foden',     position: 'MID', country: 'EN', price: 9  },
  { id: 8,  name: 'V. van Dijk',  position: 'DEF', country: 'NL', price: 8  },
  { id: 9,  name: 'A. Robertson', position: 'DEF', country: 'SC', price: 7  },
  { id: 10, name: 'R. Dias',      position: 'DEF', country: 'PT', price: 7  },
  { id: 11, name: 'A. Onana',     position: 'GK',  country: 'CM', price: 6  },
]

const POSITIONS: Position[] = ['FWD', 'MID', 'DEF', 'GK']

const positionColors: Record<Position, string> = {
  FWD: '#ef4444',
  MID: '#3b82f6',
  DEF: '#22c55e',
  GK:  '#f59e0b',
}

export default function SelectReplacement() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const incoming: Player = location.state?.incomingPlayer

  if (!incoming) {
    navigate('/market')
    return null
  }

  const handleReplace = (outgoingId: number) => {
    // TODO: call API POST /team/transfer { in: incoming.id, out: outgoingId }
    // then navigate back home
    navigate('/')
  }

  const grouped = POSITIONS.reduce((acc, pos) => {
    acc[pos] = MOCK_SQUAD.filter(p => p.position === pos)
    return acc
  }, {} as Record<Position, Player[]>)

  return (
    <div
      className="min-h-screen bg-white pb-10"
      style={{ maxWidth: 402, margin: '0 auto', fontFamily: 'Poppins, sans-serif' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-[#f4f6f8] flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-[20px] font-bold text-black">Select who to replace</h1>
      </div>

      {/* ── Incoming player banner ── */}
      <div className="mx-4 mt-3 mb-5 bg-[#f4f6f8] rounded-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 font-medium">Transferring in</p>
          <p className="text-base font-bold text-black">{incoming.name}</p>
          <p className="text-xs font-semibold" style={{ color: positionColors[incoming.position] }}>
            {incoming.position} · © {incoming.price}
          </p>
        </div>
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <p className="px-4 text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
        Tap a player to replace them
      </p>

      {/* ── Squad grouped by position ── */}
      {POSITIONS.map(pos => {
        const players = grouped[pos]
        if (!players?.length) return null
        return (
          <div key={pos} className="mb-4 px-4">
            <p
              className="text-xs font-bold mb-2"
              style={{ color: positionColors[pos] }}
            >
              {pos}
            </p>
            <div className="flex flex-col gap-2">
              {players.map(player => (
                <button
                  key={player.id}
                  onClick={() => handleReplace(player.id)}
                  className="flex items-center gap-3 bg-[#f4f6f8] rounded-xl px-4 py-3 active:scale-95 transition-transform border-2 border-transparent hover:border-black"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  {/* Info */}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-black">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.country} · © {player.price}</p>
                  </div>
                  {/* Replace arrow */}
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}