// pages/Matches.tsx

import { useState } from 'react'
import Navbar from '../components/Navbar'

// ── Types ──────────────────────────────────────────────────────────────────
interface Match {
  id: number
  homeTeam: string
  homeFlag: string
  awayTeam: string
  awayFlag: string
  time: string
  date: string
  venue: string
  completed: boolean
  homeScore?: number
  awayScore?: number
}

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_MATCHES: Match[] = [
  // Completed
  {
    id: 1,
    homeTeam: 'Brazil', homeFlag: '🇧🇷',
    awayTeam: 'Argentina', awayFlag: '🇦🇷',
    time: '11:00', date: '28 Oct', venue: 'Allianz Arena',
    completed: true, homeScore: 2, awayScore: 1,
  },
  {
    id: 2,
    homeTeam: 'France', homeFlag: '🇫🇷',
    awayTeam: 'Germany', awayFlag: '🇩🇪',
    time: '14:00', date: '28 Oct', venue: 'Stade de France',
    completed: true, homeScore: 1, awayScore: 1,
  },
  {
    id: 3,
    homeTeam: 'Spain', homeFlag: '🇪🇸',
    awayTeam: 'Portugal', awayFlag: '🇵🇹',
    time: '17:00', date: '29 Oct', venue: 'Santiago Bernabéu',
    completed: true, homeScore: 3, awayScore: 2,
  },
  // Upcoming
  {
    id: 4,
    homeTeam: 'Brazil', homeFlag: '🇧🇷',
    awayTeam: 'Argentina', awayFlag: '🇦🇷',
    time: '11:00', date: '31 Oct', venue: 'Allianz Arena',
    completed: false,
  },
  {
    id: 5,
    homeTeam: 'England', homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    awayTeam: 'Italy', awayFlag: '🇮🇹',
    time: '13:00', date: '31 Oct', venue: 'Wembley Stadium',
    completed: false,
  },
  {
    id: 6,
    homeTeam: 'Netherlands', homeFlag: '🇳🇱',
    awayTeam: 'Belgium', awayFlag: '🇧🇪',
    time: '16:00', date: '1 Nov', venue: 'Johan Cruyff Arena',
    completed: false,
  },
  {
    id: 7,
    homeTeam: 'France', homeFlag: '🇫🇷',
    awayTeam: 'Spain', awayFlag: '🇪🇸',
    time: '19:00', date: '1 Nov', venue: 'Stade de France',
    completed: false,
  },
  {
    id: 8,
    homeTeam: 'Germany', homeFlag: '🇩🇪',
    awayTeam: 'Portugal', awayFlag: '🇵🇹',
    time: '20:00', date: '2 Nov', venue: 'Allianz Arena',
    completed: false,
  },
]

// ── Country primary colors ─────────────────────────────────────────────────
const COUNTRY_COLORS: Record<string, string> = {
  'Brazil':      '#009c3b', // green
  'Argentina':   '#74acdf', // light blue
  'France':      '#002395', // dark blue
  'Germany':     '#000000', // black
  'Spain':       '#c60b1e', // red
  'Portugal':    '#006600', // green
  'England':     '#cf081f', // red
  'Italy':       '#003087', // dark blue
  'Netherlands': '#ff6600', // orange
  'Belgium':     '#000000', // black (with red/yellow — use red)
  'Croatia':     '#ff0000', // red
  'Morocco':     '#006233', // green
  'Senegal':     '#00853f', // green
  'USA':         '#3c3b6e', // navy
  'Japan':       '#bc002d', // red
  'South Korea': '#003478', // blue
}

function countryColor(team: string): string {
  return COUNTRY_COLORS[team] || '#6b7280'
}

// ── Match Card ─────────────────────────────────────────────────────────────
function MatchCard({ match }: { match: Match }) {
  const homeColor = countryColor(match.homeTeam)
  const awayColor = countryColor(match.awayTeam)

  return (
    <div
      className="relative bg-white rounded-2xl mx-4 mb-3 flex items-center px-4 py-4 shadow-sm border border-gray-100 overflow-hidden"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Left bar — home team country color */}
      <div
        className="absolute left-0 rounded-r-full"
        style={{ width: 4, height: 52, backgroundColor: homeColor }}
      />

      {/* Home team */}
      <div className="flex items-center gap-2 flex-1 justify-start pl-2">
        <span className="text-[22px]">{match.homeFlag}</span>
        <span className="text-sm font-semibold text-black">{match.homeTeam}</span>
      </div>

      {/* Centre info */}
      <div className="flex flex-col items-center flex-shrink-0 px-2">
        {match.completed ? (
          <>
            <span className="text-[15px] font-bold text-black tracking-wide">
              {match.homeScore} - {match.awayScore}
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5">{match.time}</span>
            <span className="text-[10px] text-gray-400">{match.date}</span>
          </>
        ) : (
          <>
            <span className="text-[15px] font-bold text-red-500">{match.time}</span>
            <span className="text-[11px] text-gray-500">{match.date}</span>
            <span className="text-[10px] text-gray-400 text-center">{match.venue}</span>
          </>
        )}
      </div>

      {/* Away team */}
      <div className="flex items-center gap-2 flex-1 justify-end pr-2">
        <span className="text-sm font-semibold text-black">{match.awayTeam}</span>
        <span className="text-[22px]">{match.awayFlag}</span>
      </div>

      {/* Right bar — away team country color */}
      <div
        className="absolute right-0 rounded-l-full"
        style={{ width: 4, height: 52, backgroundColor: awayColor }}
      />
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Matches() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming')

  const upcoming  = MOCK_MATCHES.filter(m => !m.completed)
  const completed = MOCK_MATCHES.filter(m => m.completed)
  const list      = activeTab === 'upcoming' ? upcoming : completed

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
      <div className="px-4 pt-8 pb-4 bg-white">
        <h1 className="text-[26px] font-bold text-black">Matches</h1>
      </div>

      {/* ── Tabs ── */}
      <div className="flex mx-4 mt-4 mb-4 bg-white rounded-xl p-1 border border-gray-100">
        {(['upcoming', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all
              ${activeTab === tab
                ? 'bg-[#1a1a1a] text-white shadow-sm'
                : 'text-gray-400'
              }`}
          >
            {tab === 'upcoming' ? `Upcoming (${upcoming.length})` : `Completed (${completed.length})`}
          </button>
        ))}
      </div>

      {/* ── Match list ── */}
      <div className="relative">
        {list.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-16">No matches here yet</p>
        ) : (
          list.map(match => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </div>

      <Navbar />
    </div>
  )
}