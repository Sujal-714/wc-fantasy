// pages/PickPlayers.tsx

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PlayerCard from '../components/Playercard'

// ── Types ──────────────────────────────────────────────────────────────────
type Position = 'FWD' | 'MID' | 'DEF' | 'GK'

interface Player {
  id: number
  name: string
  position: Position
  country: string
  price: number
}

// ── Mock data (replace with real API call later) ───────────────────────────
const MOCK_PLAYERS: Player[] = [
  { id: 1,  name: 'C. Ronaldo',  position: 'FWD', country: 'PT', price: 12 },
  { id: 2,  name: 'K. Benzema',  position: 'FWD', country: 'FR', price: 11 },
  { id: 3,  name: 'H. Kane',     position: 'FWD', country: 'EN', price: 11 },
  { id: 4,  name: 'K. Mbappé',   position: 'FWD', country: 'FR', price: 13 },
  { id: 5,  name: 'L. Messi',    position: 'FWD', country: 'AR', price: 12 },
  { id: 6,  name: 'K. De Bruyne',position: 'MID', country: 'BE', price: 12 },
  { id: 7,  name: 'L. Modric',   position: 'MID', country: 'HR', price: 10 },
  { id: 8,  name: 'T. Kroos',    position: 'MID', country: 'DE', price: 10 },
  { id: 9,  name: 'B. Fernandes',position: 'MID', country: 'PT', price: 10 },
  { id: 10, name: 'P. Foden',    position: 'MID', country: 'EN', price: 9  },
  { id: 11, name: 'V. van Dijk', position: 'DEF', country: 'NL', price: 8  },
  { id: 12, name: 'A. Robertson',position: 'DEF', country: 'SC', price: 7  },
  { id: 13, name: 'T. Alexander-Arnold', position: 'DEF', country: 'EN', price: 8 },
  { id: 14, name: 'R. Dias',     position: 'DEF', country: 'PT', price: 7  },
  { id: 15, name: 'M. Acerbi',   position: 'DEF', country: 'IT', price: 6  },
  { id: 16, name: 'A. Onana',    position: 'GK',  country: 'CM', price: 6  },
  { id: 17, name: 'M. ter Stegen',position: 'GK', country: 'DE', price: 7  },
  { id: 18, name: 'T. Courtois', position: 'GK',  country: 'BE', price: 8  },
]

// ── Limits per position ────────────────────────────────────────────────────
const LIMITS: Record<Position, number> = {
  FWD: 3,
  MID: 5,
  DEF: 5,
  GK:  2,
}

const TOTAL_BUDGET = 100

const POSITIONS: Position[] = ['FWD', 'MID', 'DEF', 'GK']

const positionColors: Record<Position, string> = {
  FWD: '#ef4444',
  MID: '#3b82f6',
  DEF: '#22c55e',
  GK:  '#f59e0b',
}

// ── Component ──────────────────────────────────────────────────────────────
export default function PickPlayers() {
  const navigate = useNavigate()

  const [search, setSearch]           = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [filterOpen, setFilterOpen]   = useState(false)
  const [filterPosition, setFilterPosition] = useState<Position | 'ALL'>('ALL')
  const [filterCountry, setFilterCountry]   = useState('')

  // Budget
  const spent = useMemo(() => {
    return MOCK_PLAYERS
      .filter(p => selectedIds.has(p.id))
      .reduce((sum, p) => sum + p.price, 0)
  }, [selectedIds])
  const budgetLeft = TOTAL_BUDGET - spent

  // Picked counts per position
  const pickedCounts = useMemo(() => {
    const counts: Record<Position, number> = { FWD: 0, MID: 0, DEF: 0, GK: 0 }
    MOCK_PLAYERS
      .filter(p => selectedIds.has(p.id))
      .forEach(p => { counts[p.position]++ })
    return counts
  }, [selectedIds])

  // Filtered player list
  const filtered = useMemo(() => {
    return MOCK_PLAYERS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchPos    = filterPosition === 'ALL' || p.position === filterPosition
      const matchCntry  = !filterCountry || p.country.toLowerCase().includes(filterCountry.toLowerCase())
      return matchSearch && matchPos && matchCntry
    })
  }, [search, filterPosition, filterCountry])

  // Toggle select / deselect
  const handleToggle = (id: number) => {
    const player = MOCK_PLAYERS.find(p => p.id === id)!
    const next = new Set(selectedIds)

    if (next.has(id)) {
      next.delete(id)
    } else {
      if (pickedCounts[player.position] >= LIMITS[player.position]) return
      if (budgetLeft < player.price) return
      next.add(id)
    }
    setSelectedIds(next)
  }

  const handleNext = () => {
    // TODO: pass selectedIds to next screen / API
    navigate('/build')
  }

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ maxWidth: 402, margin: '0 auto', fontFamily: 'Poppins, sans-serif' }}
    >

      {/* ── Search + Filter bar ── */}
      <div className="flex items-center gap-2 px-4 pt-5 pb-3">
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
          {/* Position filter */}
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
          {/* Country filter */}
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

      {/* ── Budget + Picks summary ── */}
      <div className="flex gap-3 px-4 pb-4">
        {/* Budget card */}
        <div className="flex-1 bg-[#f4f6f8] rounded-2xl p-4 flex flex-col gap-1">
          <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center mb-1">
            <span className="text-green-500 text-lg">©</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">Budget Left</p>
          <p className="text-2xl font-semibold text-black">{budgetLeft.toFixed(2)}</p>
        </div>

        {/* Picks card */}
        <div className="flex-1 bg-[#f4f6f8] rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Players Picked</p>
          <div className="flex flex-col gap-1">
            {POSITIONS.map(pos => (
              <div key={pos} className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium w-10">{pos}</span>
                <span
                  className="text-xs font-bold"
                  style={{ color: positionColors[pos] }}
                >
                  {pickedCounts[pos]} / {LIMITS[pos]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Player grid ── */}
      <div className="flex-1 px-4 pb-28 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(player => (
            <PlayerCard
              key={player.id}
              {...player}
              selected={selectedIds.has(player.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-10">No players found</p>
        )}
      </div>

      {/* ── Sticky Next button ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] bg-white px-4 py-4 border-t border-gray-100">
        <button
          onClick={handleNext}
          disabled={selectedIds.size === 0}
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="w-full bg-[#1a1a1a] text-white font-semibold py-4 rounded-xl text-base disabled:opacity-40 active:scale-95 transition-transform"
        >
          Next
        </button>
      </div>

    </div>
  )
}