// components/PitchPlayerCard.tsx

interface PitchPlayerCardProps {
  name: string
  position: 'FWD' | 'MID' | 'DEF' | 'GK'
  country?: string
  country_code?: string
  selected?: boolean
  onClick?: () => void
}

const positionColors: Record<string, string> = {
  FWD: '#ef4444',
  MID: '#3b82f6',
  DEF: '#22c55e',
  GK:  '#f59e0b',
}

export default function PitchPlayerCard({
  name,
  position,
  country,
  country_code,
  selected = false,
  onClick,
}: PitchPlayerCardProps) {
  const raw = country_code || country || ''
  const code = raw.slice(0, 2).toUpperCase()

  return (
    <button
      onClick={onClick}
      style={{ fontFamily: 'Poppins, sans-serif', width: 72 }}
      className={`flex flex-col items-center rounded-xl overflow-hidden border-2 bg-white transition-all active:scale-95
        ${selected ? 'border-black' : 'border-[#e8e8e8]'}`}
    >
      {/* Position badge */}
      <div className="w-full flex items-center justify-between px-1.5 pt-1">
        <span className="text-[9px] font-bold" style={{ color: positionColors[position] }}>
          {position}
        </span>
        {/* Country flag placeholder */}
        <span className="text-[9px] bg-gray-100 rounded-sm px-0.5 font-semibold text-gray-500">
          {code}
        </span>
      </div>

      {/* Player image placeholder */}
      <div className="w-full h-14 bg-gray-100 flex items-center justify-center overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-gray-300"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </div>

      {/* Name */}
      <div className="w-full px-1 py-1 text-center">
        <p className="text-[9px] font-semibold text-black truncate">{name}</p>
      </div>
    </button>
  )
}