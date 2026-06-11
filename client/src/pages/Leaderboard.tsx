// pages/Leaderboard.tsx

import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'
// ── Types ──────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
  rank: number
  teamName: string
  username: string
  points: number
  isCurrentUser?: boolean
}

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1,   teamName: 'Galaxy FC',     username: 'alex99',   points: 88 },
  { rank: 2,   teamName: 'Thunder United',username: 'jamie22',  points: 81 },
  { rank: 3,   teamName: 'Iron Eagles',   username: 'chris_k',  points: 76 },
  { rank: 14,  teamName: 'Night Wolves',  username: 'rafa_g',   points: 55 },
  { rank: 15,  teamName: 'Sujal FC',      username: 'sujal',    points: 52, isCurrentUser: true },
  { rank: 16,  teamName: 'Desert Kings',  username: 'omar_x',   points: 50 },
  { rank: 100, teamName: 'Last Legends',  username: 'novice1',  points: 12 },
]

// ── Rank display ───────────────────────────────────────────────────────────
function RankLabel({ rank, isTop3 }: { rank: number; isTop3: boolean }) {
  if (rank === 1) return <span className="text-lg">🥇</span>
  if (rank === 2) return <span className="text-lg">🥈</span>
  if (rank === 3) return <span className="text-lg">🥉</span>
  return (
    <span
      className="text-sm font-bold text-gray-400 w-8 text-center"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {rank > 16 ? rank : rank <= 3 ? rank : '...'}
    </span>
  )
}

// ── Entry card ─────────────────────────────────────────────────────────────
function EntryCard({ entry }: { entry: LeaderboardEntry }) {
  const isTop3 = entry.rank <= 3

  return (
    <div
      className={`flex items-center bg-white rounded-2xl px-4 py-4 mb-3 mx-4 border transition-all
        ${entry.isCurrentUser
          ? 'border-black shadow-md'
          : 'border-gray-100 shadow-sm'
        }`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Rank */}
      <div className="w-10 flex items-center justify-center flex-shrink-0">
        {entry.rank <= 3 ? (
          <RankLabel rank={entry.rank} isTop3={isTop3} />
        ) : (
          <span className="text-sm font-bold text-gray-400">
            {entry.rank === 100 ? '100' : '...'}
          </span>
        )}
      </div>

      {/* Team + username */}
      <div className="flex-1 ml-2">
        <p className={`text-sm font-bold ${entry.isCurrentUser ? 'text-black' : 'text-black'}`}>
          {entry.teamName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{entry.username}</p>
      </div>

      {/* Points */}
      <div className="flex-shrink-0">
        <span className={`text-sm font-bold ${entry.isCurrentUser ? 'text-black' : 'text-gray-700'}`}>
          {entry.points} pts.
        </span>
      </div>
    </div>
  )
}

// ── Separator dots ─────────────────────────────────────────────────────────
function DotSeparator() {
  return (
    <div className="flex justify-center items-center gap-1 my-1 mb-3">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-1 h-1 rounded-full bg-gray-300" />
      ))}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
useEffect(() => {
  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/leaderboard')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const mapped = res.data.leaderboard.map((row: any) => ({
        rank: Number(row.rank),
        teamName: row.team_name,
        username: row.username,
        points: row.total_points,
        isCurrentUser: row.username === user.username,
      }))
      setEntries(mapped)
    } catch {
      setEntries(MOCK_LEADERBOARD)
    } finally {
      setLoading(false)
    }
  }
  fetchLeaderboard()
}, [])

  // Build display list with dot separators between rank gaps
  const renderList = () => {
    const items: JSX.Element[] = []
    entries.forEach((entry, i) => {
      items.push(<EntryCard key={entry.rank} entry={entry} />)
      // Insert dots if there's a rank gap to the next entry
      if (i < entries.length - 1) {
        const nextRank = entries[i + 1].rank
        if (nextRank - entry.rank > 1) {
          items.push(<DotSeparator key={`dots-${i}`} />)
        }
      }
    })
    return items
  }

  return (
    <div
      className="min-h-screen pb-28"
      style={{
        maxWidth: 402,
        margin: '0 auto',
        fontFamily: 'Poppins, sans-serif',
        backgroundColor: '#f4f6f8',
      }}
    >
      {/* ── Header ── */}
      <div className="px-4 pt-8 pb-5 bg-white flex items-start justify-between">
        <h1 className="text-[26px] font-bold text-black">Leaderboard</h1>
        <span className="text-5xl leading-none" style={{ marginTop: -8 }}>🏆</span>
      </div>

      {/* ── List ── */}
      <div className="pt-4">
        {loading ? (
          <p className="text-center text-sm text-gray-400 mt-16">Loading...</p>
        ) : (
          renderList()
        )}
      </div>

      <Navbar />
    </div>
  )
}