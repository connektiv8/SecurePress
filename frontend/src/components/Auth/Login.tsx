import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import SecurePressLogo from '@/components/Logo'

const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
]

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('light')

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme)
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isSubmitting = loading || authLoading

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      {/* Theme Selector - Top Right */}
      <div className="absolute top-4 right-4">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </label>
          <div tabIndex={0} className="dropdown-content z-[1] p-3 shadow-2xl bg-base-100 border border-base-300 rounded-box w-72 mt-3">
            <div className="font-semibold text-sm mb-2 text-base-content">Choose Theme</div>
            <div className="space-y-1">
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors ${
                    currentTheme === theme ? 'bg-primary/10 border-l-4 border-primary' : ''
                  }`}
                >
                  <div className="flex gap-1" data-theme={theme}>
                    <div className="w-3 h-3 rounded-full bg-base-100 border border-base-content/20"></div>
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  </div>
                  <span className="capitalize text-sm flex-1 text-left">{theme}</span>
                  {currentTheme === theme && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          {/* Logo/Branding */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <SecurePressLogo size={80} />
            </div>
            <h1 className="text-4xl font-bold text-primary">
              SecurePress
            </h1>
            <p className="text-base-content/60 mt-2">Admin Portal</p>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isSubmitting}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="divider">Secure Login</div>

          <div className="text-center text-sm text-base-content/60">
            <p>Protected by Knox token authentication</p>
          </div>
        </div>
      </div>
    </div>
  )
}
