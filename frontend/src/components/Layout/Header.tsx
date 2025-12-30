interface HeaderProps {
  title?: string
}

export default function Header({ title = 'Dashboard' }: HeaderProps) {
  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4">
      <div className="flex-1">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
    </div>
  )
}
