// pages/Market.tsx

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PlayerCard from '../components/PlayerCard'

type Position = 'FWD' | 'MID' | 'DEF' | 'GK'

interface Player {
  id: number
  name: string
  position: Position
  country: string
  price: number
}

const MOCK_AVAILABLE: Player[] = [
  { id: 101, name: 'G. Jesus',     position: 'FWD', country: 'BR', price: 9  },
  { id: 102, name: 'R. Lukaku',    position: 'FWD', country: 'BE', price: 10 },
  { id: 103, name: 'A. Griezmann', position: 'FWD', country: 'FR', price: 10 },
  { id: 104, name: 'D. Maddison',  position: 'MID', country: 'EN', price: 8  },
  { id: 105, name: 'G. Donnarumma',position: 'GK',  country: 'IT', price: 7  },
  { id: 106, name: 'K. Walker',    position: 'DEF', country: 'EN', price: 6  },
  { id: 107, name: 'W. Saliba',    position: 'DEF', country: 'FR', price: 7  },
  { id: 108, name: 'J. Bellingham',position: 'MID', country: 'EN', price: 11 },
  { id: 109, name: 'V. Osimhen',   position: 'FWD', country: 'NG', price: 10 },
  { id: 110, name: 'E. Haaland',   position: 'FWD', country: 'NO', price: 13 },
  { id: 111, name: 'T. Arnold',    position: 'DEF', country: 'EN', price: 7  },
  { id: 112, name: 'M. Maignan',   position: 'GK',  country: 'FR', price: 6  },
]

const POSITIONS: Position[] = ['FWD', 'MID', 'DEF', 'GK']

const positionColors: Record<Position, string> = {
  FWD: '#ef4444',
  MID: '#3b82f6',
  DEF: '#22c55e',
  GK:  '#f59e0b',
}

// Mock current squad counts — replace with real state/context later
const SQUAD_COUNTS: Record<Position, number> = { FWD: 2, MID: 2, DEF: 2, GK: 2 }
const LIMITS: Record<Position, number>       = { FWD: 3, MID: 5, DEF: 5, GK: 2 }
const BUDGET_LEFT = 12.09

export default function Market() {
  const navigate = useNavigate()
  const [search, setSearch]               = useState('')
  const [filterOpen, setFilterOpen]       = useState(false)
  const [filterPosition, setFilterPosition] = useState<Position | 'ALL'>('ALL')
  const [filterCountry, setFilterCountry] = useState('')

  const filtered = useMemo(() => {
    return MOCK_AVAILABLE.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchPos    = filterPosition === 'ALL' || p.position === filterPosition
      const matchCntry  = !filterCountry || p.country.toLowerCase().includes(filterCountry.toLowerCase())
      return matchSearch && matchPos && matchCntry
    })
  }, [search, filterPosition, filterCountry])

  const handleSelectPlayer = (player: Player) => {
    // Navigate to replacement screen, passing chosen player via state
    navigate('/select-replacement', { state: { incomingPlayer: player } })
  }

  return (
    <div
      className="min-h-screen bg-white flex flex-col pb-24"
      style={{ maxWidth: 402, margin: '0 auto', fontFamily: 'Poppins, sans-serif' }}
    >
      {/* ── Back button ── */}
      <div className="flex items-center px-4 pt-5 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-[#f4f6f8] flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="ml-3 text-[18px] font-bold text-black">Market</span>
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex items-center gap-2 px-4 pt-2 pb-3">
        <div className="flex-1 flex items-center gap-2 bg-[#f4f6f8] rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search player"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-black placeholder-gray-400 w-full"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          />
        </div>
        <button
          onClick={() => setFilterOpen(o => !o)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
            ${filterOpen ? 'bg-black' : 'bg-[#f4f6f8]'}`}
        >
          <svg className={`w-5 h-5 ${filterOpen ? 'text-white' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
          </svg>
        </button>
      </div>

      {/* ── Filter panel ── */}
      {filterOpen && (
        <div className="mx-4 mb-3 bg-[#f4f6f8] rounded-2xl p-4 flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">POSITION</p>
            <div className="flex gap-2 flex-wrap">
              {(['ALL', ...POSITIONS] as const).map(pos => (
                <button
                  key={pos}
                  onClick={() => setFilterPosition(pos)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors
                    ${filterPosition === pos ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'}`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">COUNTRY</p>
            <input
              type="text"
              placeholder="e.g. PT, FR, EN"
              value={filterCountry}
              onChange={e => setFilterCountry(e.target.value)}
              className="w-full bg-white rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 focus:ring-2 focus:ring-black"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </div>
        </div>
      )}

      {/* ── Budget + Position summary ── */}
      <div className="flex gap-3 px-4 pb-4">
        <div className="flex-1 bg-[#f4f6f8] rounded-2xl p-4 flex flex-col gap-1">
          <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center mb-1">
            <span className="text-green-500 text-lg">©</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">Budget Left</p>
          <p className="text-2xl font-bold text-black">{BUDGET_LEFT.toFixed(2)}</p>
        </div>
        <div className="flex-1 bg-[#f4f6f8] rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Position</p>
          <div className="flex flex-col gap-1">
            {POSITIONS.map(pos => (
              <div key={pos} className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium w-10">{pos}</span>
                <span className="text-xs font-bold" style={{ color: positionColors[pos] }}>
                  {SQUAD_COUNTS[pos]} / {LIMITS[pos]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Player grid ── */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(player => (
            <PlayerCard
              key={player.id}
              {...player}
              selected={false}
              onToggle={() => handleSelectPlayer(player)}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-10">No players found</p>
        )}
      </div>

      {/* ── Sticky button ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] bg-white px-4 py-4 border-t border-gray-100">
        <button
          disabled
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="w-full bg-[#1a1a1a] text-white font-semibold py-4 rounded-xl text-base opacity-40"
        >
          Transfer Player
        </button>
      </div>
    </div>
  )
}