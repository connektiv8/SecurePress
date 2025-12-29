interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export default function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <input
        className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`.trim()}
        {...props}
      />
      {(error || helperText) && (
        <label className="label">
          <span className={`label-text-alt ${error ? 'text-error' : 'text-base-content/60'}`}>
            {error || helperText}
          </span>
        </label>
      )}
    </div>
  )
}
