import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function TeamName() {
  const navigate = useNavigate()
  const [teamName, setTeamName] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleNext = async () => {
    if (!teamName.trim()) { setError('Please enter a team name'); return }
    setLoading(true)
    setError('')
    try {
      await api.post('/team/name', { name: teamName })
      navigate('/pick')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-20"
         style={{ maxWidth: 402, margin: '0 auto' }}>

      {/* Heading */}
      <h1
        className="text-[36px] font-medium text-black leading-tight mb-10"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        Pick a name<br />for your team
      </h1>

      {/* Input */}
      <input
        type="text"
        placeholder="Enter teamname"
        value={teamName}
        onChange={e => setTeamName(e.target.value)}
        style={{ fontFamily: 'Poppins, sans-serif' }}
        className="w-full bg-[#f4f6f8] border-0 rounded-lg px-4 py-3.5 text-sm text-black placeholder-gray-400 outline-none mb-8 focus:ring-2 focus:ring-black"
      />

      {error && (
        <p className="text-red-500 text-xs text-center mb-4">{error}</p>
      )}

      {/* CTA */}
      <button
        onClick={handleNext}
        disabled={loading}
        style={{ fontFamily: 'Poppins, sans-serif' }}
        className="w-full bg-[#1a1a1a] text-white font-semibold py-4 rounded-xl text-base disabled:opacity-50 active:scale-95 transition-transform"
      >
        {loading ? 'Saving...' : 'Next'}
      </button>

    </div>
  )
}