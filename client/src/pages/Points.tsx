
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
 
interface MatchResult {
  id: number
  homeTeam: string
  homeFlag: string
  awayTeam: string
  awayFlag: string
  homeScore: number
  awayScore: number
  date: string
  totalPoints: number
  playerCount: number
}
 
const MOCK_RESULTS: MatchResult[] = [
  { id: 1, homeTeam: 'Brazil',   homeFlag: '🇧🇷', awayTeam: 'Argentina', awayFlag: '🇦🇷', homeScore: 2, awayScore: 1, date: '28 Oct', totalPoints: 34, playerCount: 6 },
  { id: 2, homeTeam: 'France',   homeFlag: '🇫🇷', awayTeam: 'Germany',   awayFlag: '🇩🇪', homeScore: 1, awayScore: 1, date: '28 Oct', totalPoints: 18, playerCount: 4 },
  { id: 3, homeTeam: 'Spain',    homeFlag: '🇪🇸', awayTeam: 'Portugal',  awayFlag: '🇵🇹', homeScore: 3, awayScore: 2, date: '29 Oct', totalPoints: 27, playerCount: 5 },
  { id: 4, homeTeam: 'England',  homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayTeam: 'Italy',     awayFlag: '🇮🇹', homeScore: 2, awayScore: 0, date: '30 Oct', totalPoints: 41, playerCount: 7 },
]
 
function pointsColor(pts: number) {
  if (pts >= 35) return '#22c55e'
  if (pts >= 20) return '#3b82f6'
  if (pts >= 10) return '#f59e0b'
  return '#ef4444'
}
 
export default function Points() {
  const navigate = useNavigate()
  const [results, setResults] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    // TODO: replace with api.get('/points/matches')
    setTimeout(() => { setResults(MOCK_RESULTS); setLoading(false) }, 300)
  }, [])
 
  const totalAllPoints = results.reduce((s, m) => s + m.totalPoints, 0)
 
  return (
    <div
      className="min-h-screen pb-28"
      style={{ maxWidth: 402, margin: '0 auto', fontFamily: 'Poppins, sans-serif', backgroundColor: '#f4f6f8' }}
    >
      {/* ── Header ── */}
      <div className="bg-white px-4 pt-8 pb-5">
        <h1 className="text-[26px] font-bold text-black">Points</h1>
 
        {/* Total points banner */}
        <div className="mt-4 bg-[#1a1a1a] rounded-2xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Points</p>
            <p className="text-[32px] font-bold text-white leading-tight">{totalAllPoints}</p>
          </div>
          <span className="text-5xl">⭐</span>
        </div>
      </div>
 
      {/* ── Match list ── */}
      <div className="px-4 pt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Matchweek Results
        </p>
 
        {loading ? (
          <p className="text-center text-sm text-gray-400 mt-10">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-10">No results yet</p>
        ) : (
          results.map(match => (
            <button
              key={match.id}
              onClick={() => navigate(`/points/${match.id}`, { state: { match } })}
              className="w-full bg-white rounded-2xl mb-3 px-4 py-4 border border-gray-100 shadow-sm active:scale-95 transition-transform text-left"
            >
              <div className="flex items-center justify-between">
                {/* Match info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{match.homeFlag}</span>
                    <span className="text-sm font-bold text-black">{match.homeScore} – {match.awayScore}</span>
                    <span className="text-lg">{match.awayFlag}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {match.homeTeam} vs {match.awayTeam} · {match.date}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {match.playerCount} players scored
                  </p>
                </div>
 
                {/* Points badge */}
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="text-[22px] font-bold"
                    style={{ color: pointsColor(match.totalPoints) }}
                  >
                    {match.totalPoints}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">pts</span>
                </div>
 
                {/* Arrow */}
                <svg className="w-4 h-4 text-gray-300 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))
        )}
      </div>
 
      <Navbar />
    </div>
  )
}
 