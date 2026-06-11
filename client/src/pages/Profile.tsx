// pages/Profile.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface Section {
  id: 'username' | 'teamname' | 'password'
  label: string
}

const SECTIONS: Section[] = [
  { id: 'username', label: 'Username'  },
  { id: 'teamname', label: 'Team Name' },
  { id: 'password', label: 'Password'  },
]

export default function Profile() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [open, setOpen]       = useState<Section['id'] | null>(null)
  const [username, setUsername] = useState(user?.username || '')
  const [teamname, setTeamname] = useState(user?.teamName || '')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw]         = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState<string | null>(null)
  const [error, setError]       = useState<string | null>(null)

  const toggle = (id: Section['id']) => {
    setOpen(prev => prev === id ? null : id)
    setError(null)
    setSuccess(null)
  }

  const showSuccess = (msg: string) => {
    setSuccess(msg)
    setError(null)
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleSaveUsername = async () => {
    if (!username.trim()) { setError('Username cannot be empty'); return }
    setLoading(true)
    try {
      await api.patch('/user/username', { username })
      const updated = { ...user, username }
      localStorage.setItem('user', JSON.stringify(updated))
      showSuccess('Username updated!')
      setOpen(null)
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to update username')
    } finally { setLoading(false) }
  }

  const handleSaveTeamname = async () => {
    if (!teamname.trim()) { setError('Team name cannot be empty'); return }
    setLoading(true)
    try {
      await api.patch('/team/name', { name: teamname })
      const updated = { ...user, teamName: teamname }
      localStorage.setItem('user', JSON.stringify(updated))
      showSuccess('Team name updated!')
      setOpen(null)
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to update team name')
    } finally { setLoading(false) }
  }

  const handleSavePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) { setError('Fill in all fields'); return }
    if (newPw.length < 6) { setError('Password must be at least 6 characters'); return }
    if (newPw !== confirmPw) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      await api.patch('/user/password', { currentPassword: currentPw, newPassword: newPw })
      showSuccess('Password updated!')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setOpen(null)
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to update password')
    } finally { setLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div
      className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-10"
      style={{ maxWidth: 402, margin: '0 auto', fontFamily: 'Poppins, sans-serif' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-[#f4f6f8] flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-[22px] font-bold text-black">Profile</h1>
      </div>

      {/* ── Avatar ── */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-[#f4f6f8] flex items-center justify-center mb-3">
          <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <p className="text-base font-bold text-black">{user?.username || 'Manager'}</p>
        <p className="text-sm text-gray-400">{user?.email || ''}</p>
      </div>

      {/* ── Toast ── */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-600 font-medium text-center">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-500 font-medium text-center">
          {error}
        </div>
      )}

      {/* ── Accordion sections ── */}
      <div className="flex flex-col gap-3">

        {/* Username */}
        <div className="bg-[#f4f6f8] rounded-2xl overflow-hidden">
          <button
            onClick={() => toggle('username')}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <span className="text-sm font-semibold text-black">Username</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{user?.username || '—'}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${open === 'username' ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {open === 'username' && (
            <div className="px-4 pb-4 flex flex-col gap-3">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="New username"
                className="w-full bg-white border-0 rounded-lg px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-black"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <button
                onClick={handleSaveUsername}
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50 active:scale-95 transition-transform"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {/* Team Name */}
        <div className="bg-[#f4f6f8] rounded-2xl overflow-hidden">
          <button
            onClick={() => toggle('teamname')}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <span className="text-sm font-semibold text-black">Team Name</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{user?.teamName || '—'}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${open === 'teamname' ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {open === 'teamname' && (
            <div className="px-4 pb-4 flex flex-col gap-3">
              <input
                type="text"
                value={teamname}
                onChange={e => setTeamname(e.target.value)}
                placeholder="New team name"
                className="w-full bg-white border-0 rounded-lg px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-black"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <button
                onClick={handleSaveTeamname}
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50 active:scale-95 transition-transform"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="bg-[#f4f6f8] rounded-2xl overflow-hidden">
          <button
            onClick={() => toggle('password')}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <span className="text-sm font-semibold text-black">Password</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">••••••</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${open === 'password' ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {open === 'password' && (
            <div className="px-4 pb-4 flex flex-col gap-3">
              <input
                type="password"
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                placeholder="Current password"
                className="w-full bg-white border-0 rounded-lg px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-black"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <input
                type="password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="New password"
                className="w-full bg-white border-0 rounded-lg px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-black"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <input
                type="password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-white border-0 rounded-lg px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-black"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <button
                onClick={handleSavePassword}
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50 active:scale-95 transition-transform"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Logout ── */}
      <button
        onClick={handleLogout}
        className="mt-8 w-full py-4 rounded-xl text-sm font-semibold text-red-500 bg-red-50 border border-red-100 active:scale-95 transition-transform"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        Log Out
      </button>
    </div>
  )
}