// pages/Admin.tsx

import { useState, useEffect } from 'react'
import api from '../services/api'

// type Position = 'GK' | 'DEF' | 'MID' | 'FWD'

interface Match {
  id: string
  home_team: string
  away_team: string
  kickoff_at: string
  status: string
}

interface ExtractedStat {
  name: string
  player_id: string | null
  goals: number
  assists: number
  minutes_played: number
  clean_sheet: boolean
  yellow_cards: number
  red_cards: number
  saves: number
  penalties_missed: number
}

export default function Admin() {
  const [matches, setMatches]           = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<string>('')
  const [extracting, setExtracting]      = useState(false)
  const [submitting, setSubmitting]      = useState(false)
  const [stats, setStats]                = useState<ExtractedStat[]>([])
  const [sourceUrl, setSourceUrl]        = useState('')
  const [error, setError]                = useState('')
  const [success, setSuccess]            = useState('')

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches')
        setMatches(res.data.matches)
      } catch {
        setError('Failed to load matches')
      }
    }
    fetchMatches()
  }, [])

  const handleExtract = async () => {
    if (!selectedMatch) {
      setError('Select a match first')
      return
    }
    setError('')
    setSuccess('')
    setStats([])
    setExtracting(true)
    try {
      const res = await api.post('/admin/extract-stats-auto', { matchId: selectedMatch })
      setStats(res.data.stats)
      setSourceUrl(res.data.sourceUrl)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Extraction failed')
    } finally {
      setExtracting(false)
    }
  }

  const updateStat = (index: number, field: keyof ExtractedStat, value: any) => {
    setStats(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleSubmit = async () => {
    const validStats = stats.filter(s => s.player_id)
    if (validStats.length === 0) {
      setError('No valid stats to submit')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await api.post(`/admin/matches/${selectedMatch}/stats`, { stats: validStats })
      setSuccess(`Submitted stats for ${validStats.length} players. Match marked finished.`)
      setStats([])
    } catch (err: any) {
      setError(err.response?.data?.error || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedMatchData = matches.find(m => m.id === selectedMatch)

  return (
    <div
      className="min-h-screen bg-white px-5 pt-10 pb-20"
      style={{ maxWidth: 600, margin: '0 auto', fontFamily: 'Poppins, sans-serif' }}
    >
      <h1 className="text-[24px] font-bold text-black mb-1">Admin — Match Stats</h1>
      <p className="text-sm text-gray-500 mb-8">
        Select a match, extract stats with AI, review, then submit.
      </p>

      {/* Match selector */}
      <label className="text-sm font-medium text-black mb-2 block">Match</label>
      <select
        value={selectedMatch}
        onChange={e => { setSelectedMatch(e.target.value); setStats([]); setError(''); setSuccess('') }}
        className="w-full bg-[#f4f6f8] rounded-lg px-4 py-3 text-sm text-black outline-none mb-2 border-0"
      >
        <option value="">Select a match...</option>
        {matches.map(m => (
          <option key={m.id} value={m.id}>
            {m.home_team} vs {m.away_team} — {new Date(m.kickoff_at).toLocaleDateString()} ({m.status})
          </option>
        ))}
      </select>

      {selectedMatchData && (
        <p className="text-xs text-gray-400 mb-6">
          Status: <span className="font-semibold">{selectedMatchData.status}</span>
        </p>
      )}

      {/* Extract button */}
      <button
        onClick={handleExtract}
        disabled={!selectedMatch || extracting}
        className="w-full bg-[#1a1a1a] text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-40 active:scale-95 transition-transform mb-6"
      >
        {extracting ? 'Searching and extracting...' : 'Extract stats with AI'}
      </button>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm text-center mb-4">{success}</p>
      )}

      {sourceUrl && (
        <p className="text-xs text-gray-400 mb-4 break-all">
          Source: <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">{sourceUrl}</a>
        </p>
      )}

      {/* Review table */}
      {stats.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-semibold text-black mb-3">
            Review extracted stats ({stats.length} players)
          </p>

          <div className="flex flex-col gap-3">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`border rounded-xl p-4 ${s.player_id ? 'border-gray-200' : 'border-red-300 bg-red-50'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-black">{s.name}</p>
                  {!s.player_id && (
                    <span className="text-xs text-red-500 font-semibold">Not matched to DB</span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Goals</label>
                    <input
                      type="number"
                      value={s.goals}
                      onChange={e => updateStat(i, 'goals', Number(e.target.value))}
                      className="w-full bg-[#f4f6f8] rounded px-2 py-1.5 text-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Assists</label>
                    <input
                      type="number"
                      value={s.assists}
                      onChange={e => updateStat(i, 'assists', Number(e.target.value))}
                      className="w-full bg-[#f4f6f8] rounded px-2 py-1.5 text-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Mins</label>
                    <input
                      type="number"
                      value={s.minutes_played}
                      onChange={e => updateStat(i, 'minutes_played', Number(e.target.value))}
                      className="w-full bg-[#f4f6f8] rounded px-2 py-1.5 text-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Saves</label>
                    <input
                      type="number"
                      value={s.saves}
                      onChange={e => updateStat(i, 'saves', Number(e.target.value))}
                      className="w-full bg-[#f4f6f8] rounded px-2 py-1.5 text-black outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-3">
                  <label className="flex items-center gap-1.5 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={s.clean_sheet}
                      onChange={e => updateStat(i, 'clean_sheet', e.target.checked)}
                    />
                    Clean sheet
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={s.yellow_cards > 0}
                      onChange={e => updateStat(i, 'yellow_cards', e.target.checked ? 1 : 0)}
                    />
                    Yellow
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={s.red_cards > 0}
                      onChange={e => updateStat(i, 'red_cards', e.target.checked ? 1 : 0)}
                    />
                    Red
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-green-600 text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-40 active:scale-95 transition-transform mt-6"
          >
            {submitting ? 'Submitting...' : `Submit stats for ${stats.filter(s => s.player_id).length} players`}
          </button>
        </div>
      )}
    </div>
  )
}