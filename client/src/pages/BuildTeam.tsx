// pages/BuildTeam.tsx

import { useNavigate } from 'react-router-dom'

const BUDGET = 100.00

export default function BuildTeam() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen bg-white flex flex-col px-5 pt-16"
      style={{ maxWidth: 402, margin: '0 auto', fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Heading */}
      <h1 className="text-[40px] font-medium text-black leading-tight">
        Build your<br />team
      </h1>

      {/* Budget + CTA — 90px below heading */}
      <div className="flex flex-col items-center" style={{ marginTop: 90 }}>
        <p className="text-[27px] text-medium mb-6">You have budget of</p>
        <div className="flex items-center gap-2 mb-8">
          <span className="text-[38px] text-black">€</span>
          <span className="text-[52px] font-semibold text-black leading-none">
            {BUDGET.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => navigate('/pick')}
          style={{ fontFamily: 'Poppins, sans-serif', width: '100%' }}
          className="bg-[#1a1a1a] text-white font-semibold py-4 rounded-xl text-base active:scale-95 transition-transform"
        >
          Pick Players
        </button>
      </div>
    </div>
  )
}