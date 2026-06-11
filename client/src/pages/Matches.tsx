import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

interface Match {
  id: string        // ← UUID string
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

const MOCK_MATCHES: Match[] = []

function flagEmoji(country: string): string {
  const flags: Record<string, string> = {
    'Brazil': '🇧🇷', 'Argentina': '🇦🇷', 'France': '🇫🇷',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Germany': '🇩🇪', 'Spain': '🇪🇸',
    'Portugal': '🇵🇹', 'Netherlands': '🇳🇱', 'Belgium': '🇧🇪',
    'Croatia': '🇭🇷', 'Uruguay': '🇺🇾', 'Colombia': '🇨🇴',
    'USA': '🇺🇸', 'Mexico': '🇲🇽', 'Senegal': '🇸🇳',
    'Morocco': '🇲🇦', 'Japan': '🇯🇵', 'South Korea': '🇰🇷',
    'Australia': '🇦🇺', 'Iran': '🇮🇷', 'Saudi Arabia': '🇸🇦',
    'Nigeria': '🇳🇬', 'Ghana': '🇬🇭', 'Ecuador': '🇪🇨',
    'Switzerland': '🇨🇭', 'Denmark': '🇩🇰', 'Poland': '🇵🇱',
    'Serbia': '🇷🇸',
  }
  return flags[country] || '🏳️'
}

const COUNTRY_COLORS: Record<string, string> = {
  'Brazil': '#009c3b', 'Argentina': '#74acdf', 'France': '#002395',
  'Germany': '#000000', 'Spain': '#c60b1e', 'Portugal': '#006600',
  'England': '#cf081f', 'Netherlands': '#ff6600', 'Belgium': '#ef4444',
  'Croatia': '#ff0000', 'Morocco': '#006233', 'Senegal': '#00853f',
  'USA': '#3c3b6e', 'Japan': '#bc002d', 'South Korea': '#003478',
}

function countryColor(team: string): string {
  return COUNTRY_COLORS[team] || '#6b7280'
}

function MatchCard({ match, onPress }: { match: Match; onPress: () => void }) {
  const homeColor = countryColor(match.homeTeam)
  const awayColor = countryColor(match.awayTeam)

  return (
    <div
      onClick={match.completed ? onPress : undefined}
      className={`relative bg-white rounded-2xl mx-4 mb-3 flex items-center px-4 py-4 shadow-sm border border-gray-100 overflow-hidden
        ${match.completed ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="absolute left-0 rounded-r-full" style={{ width: 4, height: 52, backgroundColor: homeColor }} />

      <div className="flex items-center gap-2 flex-1 justify-start pl-2">
        <span className="text-[22px]">{match.homeFlag}</span>
        <span className="text-sm font-semibold text-black">{match.homeTeam}</span>
      </div>

      <div className="flex flex-col items-center flex-shrink-0 px-2">
        {match.completed ? (
          <>
            <span className="text-[15px] font-bold text-black tracking-wide">
              {match.homeScore ?? '-'} - {match.awayScore ?? '-'}
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5">{match.time}</span>
            <span className="text-[10px] text-gray-400">{match.date}</span>
            <span className="text-[10px] text-blue-500 font-semibold mt-0.5">View points →</span>
          </>
        ) : (
          <>
            <span className="text-[15px] font-bold text-red-500">{match.time}</span>
            <span className="text-[11px] text-gray-500">{match.date}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 flex-1 justify-end pr-2">
        <span className="text-sm font-semibold text-black">{match.awayTeam}</span>
        <span className="text-[22px]">{match.awayFlag}</span>
      </div>

      <div className="absolute right-0 rounded-l-full" style={{ width: 4, height: 52, backgroundColor: awayColor }} />
    </div>
  )
}

export default function Matches() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming')
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches')
        const mapped = res.data.matches.map((m: any) => ({
          id: m.id,
          homeTeam: m.home_team,
          homeFlag: flagEmoji(m.home_team),
          awayTeam: m.away_team,
          awayFlag: flagEmoji(m.away_team),
          time: new Date(m.kickoff_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(m.kickoff_at).toLocaleDateString([], { day: 'numeric', month: 'short' }),
          venue: '',
          completed: m.status === 'finished',
          homeScore: undefined,
          awayScore: undefined,
        }))
        setMatches(mapped)
      } catch {
        setMatches(MOCK_MATCHES)
      }
    }
    fetchMatches()
  }, [])

  const upcoming  = matches.filter(m => !m.completed)
  const completed = matches.filter(m => m.completed)
  const list      = activeTab === 'upcoming' ? upcoming : completed

  return (
    <div
      className="min-h-screen pb-28"
      style={{ maxWidth: 402, margin: '0 auto', fontFamily: 'Poppins, sans-serif', backgroundColor: '#f4f6f8' }}
    >
      <div className="px-4 pt-8 pb-4 bg-white">
        <h1 className="text-[26px] font-bold text-black">Matches</h1>
      </div>

      <div className="flex mx-4 mt-4 mb-4 bg-white rounded-xl p-1 border border-gray-100">
        {(['upcoming', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all
              ${activeTab === tab ? 'bg-[#1a1a1a] text-white shadow-sm' : 'text-gray-400'}`}
          >
            {tab === 'upcoming' ? `Upcoming (${upcoming.length})` : `Completed (${completed.length})`}
          </button>
        ))}
      </div>

      <div className="relative">
        {list.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-16">No matches here yet</p>
        ) : (
          list.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              onPress={() => navigate(`/points/${match.id}`, { state: { match } })}
            />
          ))
        )}
      </div>

      <Navbar />
    </div>
  )
}