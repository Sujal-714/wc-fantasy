import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleRegister = async () => {
    if (!username || !email || !password) { setError('Fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/register', { username, email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      // New user → pick team name first
      navigate('/team-name')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-5 pt-20">

      {/* Logo */}
      <div className="w-[120px] h-[120px] bg-black rounded-full flex items-center justify-center mb-4 flex-shrink-0">
        <span style={{ fontSize: 56 }}>⚽</span>
      </div>
      <h1 className="text-[22px] font-semibold text-black mb-10"
          style={{ fontFamily: 'Poppins, sans-serif' }}>
        WC Fantasy
      </h1>

      {/* Form */}
      <div className="w-full flex flex-col">

        <label className="text-sm font-medium text-black mb-2"
               style={{ fontFamily: 'Poppins, sans-serif' }}>
          User Name
        </label>
        <input
          type="text"
          placeholder="Enter nickname"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="w-full bg-[#f4f6f8] rounded-lg px-4 py-3.5 text-sm text-black placeholder-gray-400 outline-none mb-5 focus:ring-2 focus:ring-black border-0"
        />

        <label className="text-sm font-medium text-black mb-2"
               style={{ fontFamily: 'Poppins, sans-serif' }}>
          Email
        </label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="w-full bg-[#f4f6f8] rounded-lg px-4 py-3.5 text-sm text-black placeholder-gray-400 outline-none mb-5 focus:ring-2 focus:ring-black border-0"
        />

        <label className="text-sm font-medium text-black mb-2"
               style={{ fontFamily: 'Poppins, sans-serif' }}>
          Password
        </label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="w-full bg-[#f4f6f8] rounded-lg px-4 py-3.5 text-sm text-black placeholder-gray-400 outline-none mb-7 focus:ring-2 focus:ring-black border-0"
        />

        {error && (
          <p className="text-red-500 text-xs text-center mb-4">{error}</p>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="w-full bg-[#1a1a1a] text-white font-semibold py-4 rounded-xl text-base disabled:opacity-50 active:scale-95 transition-transform mb-4"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-gray-700"
           style={{ fontFamily: 'Poppins, sans-serif' }}>
          Already have account?{' '}
          <Link to="/login" className="text-red-400 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}