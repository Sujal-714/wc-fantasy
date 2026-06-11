// components/PlayerCard.tsx

interface PlayerCardProps {
  id: string          // ← string not number
  name: string
  position: 'FWD' | 'MID' | 'DEF' | 'GK'
  country?: string
  country_code?: string
  price: number | string
  selected: boolean
  onToggle: (id: string) => void  // ← string not number
}

const positionColors: Record<string, string> = {
  FWD: '#ef4444',
  MID: '#3b82f6',
  DEF: '#22c55e',
  GK:  '#f59e0b',
}

export default function PlayerCard({
  id, name, position, country, country_code, price, selected, onToggle,
}: PlayerCardProps) {
  const raw = country_code || country || ''
  const code = raw.slice(0, 2).toUpperCase()

  return (
    <button
      onClick={() => onToggle(id)}
      style={{ fontFamily: 'Poppins, sans-serif' }}
      className={`
        relative w-full rounded-2xl overflow-hidden text-left
        border-2 transition-all duration-150 active:scale-95
        bg-white shadow-sm
        ${selected ? 'border-black' : 'border-[#f0f0f0]'}
      `}
    >
      {/* Position + Price row */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <span className="text-xs font-bold" style={{ color: positionColors[position] }}>
          {position}
        </span>
        <span className="text-xs font-semibold text-gray-500 flex items-center gap-0.5">
          <span className="text-green-500">©</span> {price}
        </span>
      </div>

      {/* Player image area */}
      <div className="relative flex justify-center items-end h-[130px] overflow-hidden">
        <div className="absolute top-1 left-3 text-[11px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
          {code}
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-20 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="px-3 py-2.5 border-t border-gray-100">
        <p className="text-sm font-semibold text-black truncate">{name}</p>
      </div>

      {/* Selected tick */}
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  )
}