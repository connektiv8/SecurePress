interface CardProps {
  title?: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export default function Card({ title, children, actions, className = '' }: CardProps) {
  return (
    <div className={`card bg-base-100 shadow-xl ${className}`.trim()}>
      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        {children}
        {actions && <div className="card-actions justify-end mt-4">{actions}</div>}
      </div>
    </div>
  )
}
