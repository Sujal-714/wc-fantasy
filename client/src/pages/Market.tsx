// pages/Market.tsx

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import PlayerCard from '../components/PlayerCard'

type Position = 'FWD' | 'MID' | 'DEF' | 'GK'

interface Player {
  id: string
  name: string
  position: Position
  country: string
  country_code: string
  price: number
  purchase_price?: number
  is_injured?: boolean
}

const POSITIONS: Position[] = ['FWD', 'MID', 'DEF', 'GK']

const positionColors: Record<Position, string> = {
  FWD: '#ef4444',
  MID: '#3b82f6',
  DEF: '#22c55e',
  GK:  '#f59e0b',
}

// Mock current squad counts — replace with real state/context later
const LIMITS: Record<Position, number> = { FWD: 3, MID: 5, DEF: 5, GK: 2 }

export default function Market() {
  const navigate = useNavigate()
  const [search, setSearch]               = useState('')
  const [filterOpen, setFilterOpen]       = useState(false)
  const [filterPosition, setFilterPosition] = useState<Position | 'ALL'>('ALL')
  const [filterCountry, setFilterCountry] = useState('')
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([])
  const [phase, setPhase] = useState<'selectOutgoing' | 'market'>('selectOutgoing')
  const [selectedOutgoing, setSelectedOutgoing] = useState<Player | null>(null)
  const [selectedIncoming, setSelectedIncoming] = useState<Player | null>(null)
  const [squadCounts, setSquadCounts] = useState<Record<Position, number>>({ FWD: 0, MID: 0, DEF: 0, GK: 0 })
  const [budgetLeft, setBudgetLeft]   = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadMarket = async () => {
      try {
        const [teamRes, playersRes] = await Promise.all([
          api.get('/team'),
          api.get('/players', {
            params: {
              position: filterPosition === 'ALL' ? undefined : filterPosition,
              search: search || undefined,
            }
          })
        ])

        const teamIds = new Set(teamRes.data.players.map((p: any) => p.player_id))

        setTeamPlayers(teamRes.data.players.map((p: any) => ({
          id: String(p.player_id),
          name: p.name,
          position: p.position,
          country: p.country,
          country_code: p.country_code || String(p.country || '').slice(0, 2).toUpperCase(),
          price: p.price,
          purchase_price: Number(p.purchase_price),
          is_injured: p.is_injured,
        })))

        const rawBudget = Number(teamRes.data.team.budget_remaining)
        setBudgetLeft(Number.isFinite(rawBudget) ? Math.max(0, rawBudget) : 0)

        setSquadCounts({
          FWD: teamRes.data.players.filter((p: any) => p.position === 'FWD').length,
          MID: teamRes.data.players.filter((p: any) => p.position === 'MID').length,
          DEF: teamRes.data.players.filter((p: any) => p.position === 'DEF').length,
          GK:  teamRes.data.players.filter((p: any) => p.position === 'GK').length,
        })

        const available = playersRes.data.players
          .filter((p: any) => !teamIds.has(p.id))
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            position: p.position,
            country: p.country,
            country_code: p.country_code || String(p.country || '').slice(0, 2).toUpperCase(),
            price: p.price,
          }))

        setAvailablePlayers(available)
      } catch (err) {
        console.error('Failed to load market', err)
      }
    }

    loadMarket()
  }, [filterPosition, search])

  const filtered = useMemo(() => {
    return availablePlayers.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchPos    = filterPosition === 'ALL' || p.position === filterPosition
      const matchCntry  = !filterCountry || p.country.toLowerCase().includes(filterCountry.toLowerCase()) || p.country_code.toLowerCase().includes(filterCountry.toLowerCase())
      return matchSearch && matchPos && matchCntry
    })
  }, [availablePlayers, search, filterPosition, filterCountry])

  const calculateRefund = (player: Player) => {
    const price = Number(player.purchase_price ?? 0)
    if (!price) return 0
    const rate = player.is_injured ? 0.8 : 0.7
    return parseFloat((price * rate).toFixed(1))
  }

  const currentRefund = selectedOutgoing ? calculateRefund(selectedOutgoing) : 0
  const effectiveBudget = Math.max(0, selectedOutgoing ? budgetLeft + currentRefund : budgetLeft)

  const handleSelectOutgoing = (player: Player) => {
    setSelectedOutgoing(player)
    setSelectedIncoming(null)
    setError(null)
    setPhase('market')
  }

  const handleSelectPlayer = (player: Player) => {
    if (!selectedOutgoing) {
      setError('Select an outgoing player first to compute refund and available budget.')
      return
    }

    if (player.position !== selectedOutgoing.position) {
      setError(`Incoming player must match outgoing position (${selectedOutgoing.position}).`)
      return
    }

    if (player.price > effectiveBudget) {
      setError(`Not enough budget. After refund you have ${effectiveBudget.toFixed(1)}.`)
      return
    }

    setSelectedIncoming(player)
    setError(null)
  }

  const handleProceedToMarket = () => {
    if (!selectedOutgoing) {
      setError('Choose an outgoing player first.')
      return
    }
    setError(null)
    setPhase('market')
  }

  const handleTransfer = async () => {
    if (!selectedOutgoing || !selectedIncoming) return
    setSubmitting(true)
    try {
      await api.patch('/team/transfer', {
        player_out_id: selectedOutgoing.id,
        player_in_id: selectedIncoming.id,
      })
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Transfer failed')
    } finally {
      setSubmitting(false)
    }
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
        <div className="ml-3">
          <p className="text-[18px] font-bold text-black">Market</p>
          <p className="text-xs text-gray-500">{phase === 'selectOutgoing' ? 'Step 1: choose outgoing' : 'Step 2: choose replacement'}</p>
        </div>
      </div>

      {phase === 'selectOutgoing' ? (
        <>
          <div className="flex gap-3 px-4 pb-4">
            <div className="flex-1 bg-[#f4f6f8] rounded-2xl p-4 flex flex-col gap-1">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center mb-1">
                <span className="text-green-500 text-lg">©</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Budget Left</p>
              <p className="text-2xl font-bold text-black">{budgetLeft.toFixed(2)}</p>
              {selectedOutgoing && (
                <p className="text-xs text-gray-500">After refund: {effectiveBudget.toFixed(1)}</p>
              )}
            </div>
            <div className="flex-1 bg-[#f4f6f8] rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">Squad</p>
              <div className="flex flex-col gap-1">
                {POSITIONS.map(pos => (
                  <div key={pos} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium w-10">{pos}</span>
                    <span className="text-xs font-bold" style={{ color: positionColors[pos] }}>
                      {squadCounts[pos]} / {LIMITS[pos]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-4 mb-3 bg-[#f4f6f8] rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-500 mb-3">Select outgoing player</p>
            <div className="grid grid-cols-2 gap-2">
              {teamPlayers.map(player => {
                const isActive = selectedOutgoing?.id === player.id
                return (
                  <button
                    key={player.id}
                    onClick={() => handleSelectOutgoing(player)}
                    className={`rounded-2xl border px-3 py-3 text-left transition-colors ${isActive ? 'border-black bg-white' : 'border-transparent bg-white hover:border-gray-300'}`}
                  >
                    <p className="text-sm font-semibold text-black truncate">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.position} · © {player.purchase_price?.toFixed(1) ?? player.price.toFixed(1)}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] bg-white px-4 py-4 border-t border-gray-100">
            <button
              disabled={!selectedOutgoing}
              onClick={handleProceedToMarket}
              style={{ fontFamily: 'Poppins, sans-serif' }}
              className={`w-full font-semibold py-4 rounded-xl text-base transition ${selectedOutgoing ? 'bg-black text-white' : 'bg-[#1a1a1a] text-white opacity-40'}`}
            >
              Continue to market
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-3 px-4 pb-4">
            <div className="flex-1 bg-[#f4f6f8] rounded-2xl p-4 flex flex-col gap-1">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center mb-1">
                <span className="text-green-500 text-lg">©</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Budget with refund</p>
              <p className="text-2xl font-bold text-black">{effectiveBudget.toFixed(1)}</p>
              <span className="text-xs text-gray-500">Refund: {currentRefund.toFixed(1)}</span>
            </div>
            <div className="flex-1 bg-[#f4f6f8] rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">Position</p>
              <div className="flex flex-col gap-1">
                {POSITIONS.map(pos => (
                  <div key={pos} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium w-10">{pos}</span>
                    <span className="text-xs font-bold" style={{ color: positionColors[pos] }}>
                      {squadCounts[pos]} / {LIMITS[pos]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500">Outgoing player</p>
                <p className="text-sm font-bold text-black truncate">{selectedOutgoing?.name || 'No outgoing selected'}</p>
                {selectedOutgoing && (
                  <p className="text-xs text-gray-400">{selectedOutgoing.position} · © {selectedOutgoing.purchase_price?.toFixed(1) ?? selectedOutgoing.price.toFixed(1)}</p>
                )}
              </div>
              <button
                onClick={() => setPhase('selectOutgoing')}
                className="inline-flex h-10 items-center justify-center rounded-full border border-black bg-black px-3 text-xs font-semibold text-white transition hover:bg-gray-900"
              >
                <span>Change</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 pt-2 pb-3">
            <div className="flex-1 flex items-center gap-2 bg-[#f4f6f8] rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search replacement"
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

          {error && (
            <div className="mx-4 mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex-1 px-4 pb-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(player => (
                <PlayerCard
                  key={player.id}
                  {...player}
                  selected={selectedIncoming?.id === player.id}
                  onToggle={() => handleSelectPlayer(player)}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-sm text-gray-400 mt-10">No players found</p>
            )}
          </div>

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] bg-white px-4 py-4 border-t border-gray-100">
            <button
              disabled={!selectedOutgoing || !selectedIncoming || submitting}
              onClick={handleTransfer}
              style={{ fontFamily: 'Poppins, sans-serif' }}
              className={`w-full font-semibold py-4 rounded-xl text-base transition ${selectedOutgoing && selectedIncoming && !submitting ? 'bg-black text-white' : 'bg-[#1a1a1a] text-white opacity-40'}`}
            >
              {submitting ? 'Transferring...' : selectedIncoming ? `Transfer ${selectedIncoming.name}` : 'Select incoming player'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}