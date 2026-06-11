import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setError('Fill in all fields'); return }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
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
      <div className="w-full flex flex-col gap-0">

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
          className="w-full bg-[#f4f6f8] border-0 rounded-lg px-4 py-3.5 text-sm text-black placeholder-gray-400 outline-none mb-5 focus:ring-2 focus:ring-black"
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
          className="w-full bg-[#f4f6f8] border-0 rounded-lg px-4 py-3.5 text-sm text-black placeholder-gray-400 outline-none mb-6 focus:ring-2 focus:ring-black"
        />

        {error && (
          <p className="text-red-500 text-xs text-center mb-4">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="w-full bg-[#1a1a1a] text-white font-semibold py-4 rounded-xl text-base disabled:opacity-50 active:scale-95 transition-transform mb-4"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-500"
           style={{ fontFamily: 'Poppins, sans-serif' }}>
          Don't have account?{' '}
          <Link to="/register" className="text-red-400 font-semibold">
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}