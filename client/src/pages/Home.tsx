// pages/Home.tsx

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import PitchPlayerCard from '../components/PitchPlayerCard'
import Navbar from '../components/Navbar'

// ── Types ──────────────────────────────────────────────────────────────────
type Position = 'FWD' | 'MID' | 'DEF' | 'GK'

interface Player {
  id: number
  name: string
  position: Position
  country: string
}

interface Squad {
  teamName: string
  starters: Player[]
  bench: Player[]
}

// ── Mock fallback ──────────────────────────────────────────────────────────
const MOCK_SQUAD: Squad = {
  teamName: 'Sujal FC',
  starters: [
    { id: 1,  name: 'C. Ronaldo',   position: 'FWD', country: 'PT' },
    { id: 2,  name: 'K. Mbappé',    position: 'FWD', country: 'FR' },
    { id: 3,  name: 'H. Kane',      position: 'FWD', country: 'EN' },
    { id: 4,  name: 'K. De Bruyne', position: 'MID', country: 'BE' },
    { id: 5,  name: 'L. Modric',    position: 'MID', country: 'HR' },
    { id: 6,  name: 'B. Fernandes', position: 'MID', country: 'PT' },
    { id: 7,  name: 'P. Foden',     position: 'MID', country: 'EN' },
    { id: 8,  name: 'V. van Dijk',  position: 'DEF', country: 'NL' },
    { id: 9,  name: 'A. Robertson', position: 'DEF', country: 'SC' },
    { id: 10, name: 'R. Dias',      position: 'DEF', country: 'PT' },
    { id: 11, name: 'A. Onana',     position: 'GK',  country: 'CM' },
  ],
  bench: [
    { id: 12, name: 'L. Messi',    position: 'FWD', country: 'AR' },
    { id: 13, name: 'T. Kroos',    position: 'MID', country: 'DE' },
    { id: 14, name: 'M. Acerbi',   position: 'DEF', country: 'IT' },
    { id: 15, name: 'T. Courtois', position: 'GK',  country: 'BE' },
  ],
}

// ── Formation builder ──────────────────────────────────────────────────────
function buildFormation(starters: Player[]) {
  const gk  = starters.filter(p => p.position === 'GK')
  const def = starters.filter(p => p.position === 'DEF')
  const mid = starters.filter(p => p.position === 'MID')
  const fwd = starters.filter(p => p.position === 'FWD')
  return [fwd, mid, def, gk]
}

// ── Pitch SVG lines overlay ────────────────────────────────────────────────
function PitchLines() {
  // Rendered at full width/height of pitch container via absolute positioning
  // viewBox matches the pitch container proportions (370 wide × 520 tall approx)
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 370 520"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {/* Outer boundary */}
      <rect x="14" y="10" width="342" height="500" rx="4"
        fill="none" stroke="#c8cdd4" strokeWidth="1.5" />

      {/* Halfway line */}
      <line x1="14" y1="260" x2="356" y2="260"
        stroke="#c8cdd4" strokeWidth="1.5" />

      {/* Centre circle */}
      <circle cx="185" cy="260" r="44"
        fill="none" stroke="#c8cdd4" strokeWidth="1.5" />

      {/* Centre spot */}
      <circle cx="185" cy="260" r="3" fill="#c8cdd4" />

      {/* Top penalty box */}
      <rect x="88" y="10" width="194" height="80" rx="0"
        fill="none" stroke="#c8cdd4" strokeWidth="1.5" />

      {/* Top 6-yard box */}
      <rect x="136" y="10" width="98" height="30" rx="0"
        fill="none" stroke="#c8cdd4" strokeWidth="1.5" />

      {/* Top penalty spot */}
      <circle cx="185" cy="68" r="2.5" fill="#c8cdd4" />

      {/* Top penalty arc */}
      <path d="M 148 90 A 44 44 0 0 0 222 90"
        fill="none" stroke="#c8cdd4" strokeWidth="1.5" />

      {/* Bottom penalty box */}
      <rect x="88" y="430" width="194" height="80" rx="0"
        fill="none" stroke="#c8cdd4" strokeWidth="1.5" />

      {/* Bottom 6-yard box */}
      <rect x="136" y="480" width="98" height="30" rx="0"
        fill="none" stroke="#c8cdd4" strokeWidth="1.5" />

      {/* Bottom penalty spot */}
      <circle cx="185" cy="452" r="2.5" fill="#c8cdd4" />

      {/* Bottom penalty arc */}
      <path d="M 148 430 A 44 44 0 0 1 222 430"
        fill="none" stroke="#c8cdd4" strokeWidth="1.5" />
    </svg>
  )
}

// ── Component ──────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()
  const [squad, setSquad]         = useState<Squad | null>(null)
  const [loading, setLoading]     = useState(true)
  const [swapMode, setSwapMode]   = useState(false)
  const [swapFirst, setSwapFirst] = useState<number | null>(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchSquad = async () => {
      try {
        const res = await api.get('/team/my-team')
        setSquad(res.data)
      } catch {
        setSquad(MOCK_SQUAD)
      } finally {
        setLoading(false)
      }
    }
    fetchSquad()
  }, [])

  const handlePlayerClick = (playerId: number) => {
    if (!swapMode) return
    if (swapFirst === null) {
      setSwapFirst(playerId)
    } else {
      setSquad(prev => {
        if (!prev) return prev
        const newStarters = [...prev.starters]
        const i = newStarters.findIndex(p => p.id === swapFirst)
        const j = newStarters.findIndex(p => p.id === playerId)
        if (i !== -1 && j !== -1) {
          ;[newStarters[i], newStarters[j]] = [newStarters[j], newStarters[i]]
        }
        return { ...prev, starters: newStarters }
      })
      setSwapFirst(null)
      setSwapMode(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Loading squad...
        </p>
      </div>
    )
  }

  if (!squad) return null

  const formation = buildFormation(squad.starters)

  return (
    <div
      className="min-h-screen bg-white pb-24"
      style={{ maxWidth: 402, margin: '0 auto', fontFamily: 'Poppins, sans-serif' }}
    >

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <h1 className="text-[26px] font-bold text-black">
          Hi, {user?.username || 'Manager'}
        </h1>
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-[#f4f6f8] flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </button>
      </div>

      {/* ── Team name ── */}
      <p className="px-4 text-[17px] font-bold text-black mb-3">
        {squad.teamName} Starting 11
      </p>

      {/* ── Pitch ── */}
      <div className="mx-4 rounded-2xl overflow-hidden border border-gray-200 bg-[#f0f2f5]">
        {/* relative container so SVG lines sit behind player rows */}
        <div className="relative py-5 px-3" style={{ minHeight: 480 }}>
          <PitchLines />

          {/* Player rows — sit on top of SVG lines */}
          <div className="relative z-10 flex flex-col gap-4 h-full justify-around" style={{ minHeight: 460 }}>
            {formation.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-2">
                {row.map(player => (
                  <PitchPlayerCard
                    key={player.id}
                    name={player.name}
                    position={player.position}
                    country={player.country}
                    selected={swapFirst === player.id}
                    onClick={() => handlePlayerClick(player.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bench ── */}
      <p className="px-4 mt-5 mb-3 text-[17px] font-bold text-black">My Bench</p>
      <div className="flex gap-2 px-4 overflow-x-auto pb-1">
        {squad.bench.map(player => (
          <PitchPlayerCard
            key={player.id}
            name={player.name}
            position={player.position}
            country={player.country}
          />
        ))}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-3 px-4 mt-6">
        <button
          onClick={() => { setSwapMode(s => !s); setSwapFirst(null) }}
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="flex-1 py-4 rounded-xl text-sm font-semibold bg-[#1a1a1a] text-white active:scale-95 transition-transform"
        >
          {swapMode ? 'Cancel Swap' : 'Swap Player'}
        </button>
        <button
          onClick={() => navigate('/market')}
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="flex-1 py-4 rounded-xl text-sm font-semibold bg-blue-500 text-white active:scale-95 transition-transform"
        >
          Transfer Player
        </button>
      </div>

      {swapMode && (
        <p className="text-center text-xs text-gray-400 mt-2 px-4">
          {swapFirst === null
            ? 'Tap a player to select for swap'
            : 'Now tap the player to swap with'}
        </p>
      )}

      <Navbar />
    </div>
  )
}