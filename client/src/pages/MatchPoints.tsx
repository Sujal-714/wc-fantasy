// pages/MatchPoints.tsx

import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

// ── Types ──────────────────────────────────────────────────────────────────
type Position = 'FWD' | 'MID' | 'DEF' | 'GK'

interface Stats {
  goals: number
  assists: number
  minutes_played: number
  clean_sheet: boolean
  yellow_cards: number
  red_cards: number
  penalties_missed: number
  saves: number
}

interface PlayerPoints {
  id: number
  name: string
  position: Position
  country: string
  stats: Stats
  points: number
}

// ── Point calculation (mirrors your backend) ───────────────────────────────
function calculatePoints(stats: Stats, position: Position): number {
  let points = 0
  if (stats.minutes_played >= 60) points += 2
  else if (stats.minutes_played > 0) points += 1

  if (position === 'GK' || position === 'DEF') points += stats.goals * 6
  else if (position === 'MID') points += stats.goals * 5
  else points += stats.goals * 4

  points += stats.assists * 3

  if (stats.clean_sheet) {
    if (position === 'GK')       points += 6
    else if (position === 'DEF') points += 4
    else if (position === 'MID') points += 1
  }

  if (position === 'GK') points += Math.floor(stats.saves / 3)

  points -= stats.yellow_cards * 1
  points -= stats.red_cards * 3
  points -= stats.penalties_missed * 2

  return points
}

// ── Mock player data for a match ───────────────────────────────────────────
function generateMockPlayers(): PlayerPoints[] {
  const squad: { id: number; name: string; position: Position; country: string }[] = [
    { id: 1,  name: 'A. Onana',     position: 'GK',  country: 'CM' },
    { id: 8,  name: 'V. van Dijk',  position: 'DEF', country: 'NL' },
    { id: 9,  name: 'A. Robertson', position: 'DEF', country: 'SC' },
    { id: 10, name: 'R. Dias',      position: 'DEF', country: 'PT' },
    { id: 4,  name: 'K. De Bruyne', position: 'MID', country: 'BE' },
    { id: 5,  name: 'L. Modric',    position: 'MID', country: 'HR' },
    { id: 6,  name: 'B. Fernandes', position: 'MID', country: 'PT' },
    { id: 1,  name: 'C. Ronaldo',   position: 'FWD', country: 'PT' },
    { id: 2,  name: 'K. Mbappé',    position: 'FWD', country: 'FR' },
    { id: 3,  name: 'H. Kane',      position: 'FWD', country: 'EN' },
  ]

  return squad.map(p => {
    const stats: Stats = {
      goals:            Math.random() < 0.15 ? 1 : 0,
      assists:          Math.random() < 0.2  ? 1 : 0,
      minutes_played:   Math.random() < 0.8  ? 90 : Math.floor(Math.random() * 60),
      clean_sheet:      Math.random() < 0.3,
      yellow_cards:     Math.random() < 0.1  ? 1 : 0,
      red_cards:        Math.random() < 0.02 ? 1 : 0,
      penalties_missed: 0,
      saves:            p.position === 'GK' ? Math.floor(Math.random() * 8) : 0,
    }
    return { ...p, stats, points: calculatePoints(stats, p.position) }
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────
const positionColors: Record<Position, string> = {
  FWD: '#ef4444', MID: '#3b82f6', DEF: '#22c55e', GK: '#f59e0b',
}

function pointsColor(pts: number) {
  if (pts >= 10) return '#22c55e'
  if (pts >= 5)  return '#3b82f6'
  if (pts >= 2)  return '#f59e0b'
  return '#ef4444'
}

// ── Stat row ───────────────────────────────────────────────────────────────
function StatRow({ label, value, points, hide }: { label: string; value: string; points: number; hide?: boolean }) {
  if (hide) return null
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-black">{value}</span>
        <span
          className="text-xs font-bold w-12 text-right"
          style={{ color: points === 0 ? '#9ca3af' : points > 0 ? '#22c55e' : '#ef4444' }}
        >
          {points > 0 ? `+${points}` : points === 0 ? '—' : points} pts
        </span>
      </div>
    </div>
  )
}

// ── Player card ────────────────────────────────────────────────────────────
function PlayerPointCard({ player }: { player: PlayerPoints }) {
  const [expanded, setExpanded] = useState(false)
  const s = player.stats

  const minutesPts  = s.minutes_played >= 60 ? 2 : s.minutes_played > 0 ? 1 : 0
  const goalsPts    = player.position === 'GK' || player.position === 'DEF'
    ? s.goals * 6 : player.position === 'MID' ? s.goals * 5 : s.goals * 4
  const assistsPts  = s.assists * 3
  const csPts       = s.clean_sheet
    ? player.position === 'GK' ? 6 : player.position === 'DEF' ? 4 : player.position === 'MID' ? 1 : 0
    : 0
  const savesPts    = player.position === 'GK' ? Math.floor(s.saves / 3) : 0
  const yellowPts   = -(s.yellow_cards * 1)
  const redPts      = -(s.red_cards * 3)
  const penPts      = -(s.penalties_missed * 2)

  return (
    <div className="bg-white rounded-2xl mb-3 overflow-hidden border border-gray-100 shadow-sm">
      {/* Header row */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center px-4 py-3.5 gap-3 text-left"
      >
        {/* Position badge */}
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white flex-shrink-0"
          style={{ backgroundColor: positionColors[player.position] }}
        >
          {player.position}
        </span>

        {/* Name + country */}
        <div className="flex-1">
          <p className="text-sm font-bold text-black">{player.name}</p>
          <p className="text-[11px] text-gray-400">{player.country} · {s.minutes_played} min</p>
        </div>

        {/* Points */}
        <span
          className="text-[20px] font-bold flex-shrink-0"
          style={{ color: pointsColor(player.points) }}
        >
          {player.points}
        </span>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Quick badges */}
      {!expanded && (
        <div className="flex gap-2 px-4 pb-3 flex-wrap">
          {s.goals > 0      && <span className="text-[10px] bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded-full">⚽ {s.goals} goal{s.goals > 1 ? 's' : ''}</span>}
          {s.assists > 0    && <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">🎯 {s.assists} assist{s.assists > 1 ? 's' : ''}</span>}
          {s.clean_sheet && (player.position === 'GK' || player.position === 'DEF' || player.position === 'MID')
                            && <span className="text-[10px] bg-yellow-50 text-yellow-600 font-semibold px-2 py-0.5 rounded-full">🧤 Clean sheet</span>}
          {s.yellow_cards > 0 && <span className="text-[10px] bg-yellow-50 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">🟨 Yellow</span>}
          {s.red_cards > 0    && <span className="text-[10px] bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">🟥 Red</span>}
        </div>
      )}

      {/* Expanded breakdown */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide my-2">Breakdown</p>
          <StatRow label="Minutes played"   value={`${s.minutes_played} min`} points={minutesPts} />
          <StatRow label="Goals"            value={`${s.goals}`}             points={goalsPts}   hide={s.goals === 0 && goalsPts === 0} />
          <StatRow label="Assists"          value={`${s.assists}`}           points={assistsPts} hide={s.assists === 0} />
          <StatRow label="Clean sheet"      value={s.clean_sheet ? 'Yes' : 'No'} points={csPts} hide={player.position === 'FWD'} />
          <StatRow label="Saves"            value={`${s.saves}`}             points={savesPts}   hide={player.position !== 'GK'} />
          <StatRow label="Yellow card"      value={`${s.yellow_cards}`}      points={yellowPts}  hide={s.yellow_cards === 0} />
          <StatRow label="Red card"         value={`${s.red_cards}`}         points={redPts}     hide={s.red_cards === 0} />
          <StatRow label="Penalty missed"   value={`${s.penalties_missed}`}  points={penPts}     hide={s.penalties_missed === 0} />

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-black">Total</span>
            <span className="text-base font-bold" style={{ color: pointsColor(player.points) }}>
              {player.points} pts
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
const POSITIONS: Position[] = ['GK', 'DEF', 'MID', 'FWD']

export default function MatchPoints() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { id }    = useParams()
  const match     = location.state?.match

  const [players, setPlayers] = useState<PlayerPoints[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal]     = useState(0)  // ← add this


  useEffect(() => {
    // TODO: replace with api.get(`/points/match/${id}`)
    const fetchPoints = async () => {
    try {
      const res = await api.get(`/matches/${id}/my-points`)
      const mapped = res.data.players.map((p: any) => ({
        id: p.player_id || Math.random(),
        name: p.name,
        position: p.position,
        country: p.country,
        stats: {
          goals:            p.goals,
          assists:          p.assists,
          minutes_played:   p.minutes_played,
          clean_sheet:      p.clean_sheet,
          yellow_cards:     p.yellow_cards,
          red_cards:        p.red_cards,
          penalties_missed: p.penalties_missed,
          saves:            p.saves,
        },
        points: p.fantasy_points,
      }))
      setPlayers(mapped)
      setTotal(res.data.totalPoints)
    } catch {
      setPlayers(generateMockPlayers()) // fallback
    } finally {
      setLoading(false)
    }
  }
  fetchPoints()
  }, [id])

  // const totalPoints = players.reduce((s, p) => s + p.points, 0)

  const grouped = POSITIONS.reduce((acc, pos) => {
    acc[pos] = players.filter(p => p.position === pos)
    return acc
  }, {} as Record<Position, PlayerPoints[]>)

  return (
    <div
      className="min-h-screen pb-10"
      style={{ maxWidth: 402, margin: '0 auto', fontFamily: 'Poppins, sans-serif', backgroundColor: '#f4f6f8' }}
    >
      {/* ── Header ── */}
      <div className="bg-white px-4 pt-6 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-[#f4f6f8] flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-[20px] font-bold text-black">Match Points</h1>
        </div>

        {/* Match result card */}
        {match && (
          <div className="bg-[#f4f6f8] rounded-2xl px-4 py-3 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{match.homeFlag}</span>
              <span className="text-sm font-bold text-black">{match.homeTeam}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-black">{match.homeScore} – {match.awayScore}</span>
              <span className="text-[10px] text-gray-400">{match.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-black">{match.awayTeam}</span>
              <span className="text-xl">{match.awayFlag}</span>
            </div>
          </div>
        )}

        {/* Total points */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">Your points this match</p>
          <p className="text-[26px] font-bold text-black">{total} <span className="text-sm text-gray-400 font-medium">pts</span></p>
        </div>
      </div>

      {/* ── Players by position ── */}
      <div className="px-4 pt-4">
        {loading ? (
          <p className="text-center text-sm text-gray-400 mt-10">Loading...</p>
        ) : (
          POSITIONS.map(pos => {
            const group = grouped[pos]
            if (!group?.length) return null
            return (
              <div key={pos} className="mb-2">
                <p
                  className="text-xs font-bold mb-2 uppercase tracking-wide"
                  style={{ color: positionColors[pos] }}
                >
                  {pos}
                </p>
                {group.map(player => (
                  <PlayerPointCard key={player.id} player={player} />
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}