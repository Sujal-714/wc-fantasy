interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
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
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}