import { useState, useEffect } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'

const themes = [
  'securepress',
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

interface HeaderProps {
  title?: string
}

export default function Header({ title = 'Dashboard' }: HeaderProps) {
  const [currentTheme, setCurrentTheme] = useState('securepress')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'securepress'
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme)
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  const toggleDarkMode = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    handleThemeChange(newTheme)
  }

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4">
      <div className="flex-1">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="flex-none gap-2">
        {/* Theme Selector */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 max-h-96 overflow-auto">
            {themes.map((theme) => (
              <li key={theme}>
                <button
                  onClick={() => handleThemeChange(theme)}
                  className={currentTheme === theme ? 'active' : ''}
                >
                  <span className="capitalize">{theme}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Dark/Light Toggle */}
        <button
          onClick={toggleDarkMode}
          className="btn btn-ghost btn-circle"
          title="Toggle dark mode"
        >
          {currentTheme === 'dark' ? (
            <FiSun className="w-5 h-5" />
          ) : (
            <FiMoon className="w-5 h-5" />
          )}
        </button>

        {/* User Menu */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10">
              <span className="text-xl">A</span>
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
