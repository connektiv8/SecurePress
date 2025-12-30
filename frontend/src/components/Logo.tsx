interface LogoProps {
  className?: string
  size?: number
}

export default function SecurePressLogo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circle background - using primary color */}
      <circle cx="16" cy="16" r="16" style={{ fill: 'var(--fallback-p,oklch(var(--p)/1))' }} />
      
      {/* S letter path - white color for contrast */}
      <path
        d="M16 6C12.5 6 10 7.5 10 10C10 11.5 10.8 12.5 12 13C10.5 13.5 9.5 15 9.5 16.5C9.5 19.5 12 22 16 22C19.5 22 22 20.5 22 18C22 16.5 21.2 15.5 20 15C21.5 14.5 22.5 13 22.5 11.5C22.5 8.5 20 6 16 6ZM16 8C18.5 8 20 9 20 10.5C20 12 18.5 13 16 13C13.5 13 12 12 12 10.5C12 9 13.5 8 16 8ZM16 15C18.5 15 20 16 20 17.5C20 19 18.5 20 16 20C13.5 20 12 19 12 17.5C12 16 13.5 15 16 15Z"
        style={{ fill: 'var(--fallback-pc,oklch(var(--pc)/1))' }}
      />
    </svg>
  )
}

export function SecurePressWordmark({ className = '', height = 40 }: { className?: string; height?: number }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SecurePressLogo size={height} />
      <div className="flex flex-col">
        <span className="text-xl font-bold leading-tight">SecurePress</span>
        <span className="text-xs opacity-70 leading-tight">Admin Dashboard</span>
      </div>
    </div>
  )
}
