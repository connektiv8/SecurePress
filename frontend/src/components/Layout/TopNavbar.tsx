import { Link, useNavigate } from 'react-router-dom'
import { FiHome, FiMoon, FiSun } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { useStateContext } from '@/contexts/ContextProvider'
import ThemeSelector from '@/components/ThemeSelector'

export default function TopNavbar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { currentTheme, setCurrentTheme, isDarkTheme, fontSize, increaseFontSize, decreaseFontSize } = useStateContext()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const toggleLightDark = () => {
    setCurrentTheme(isDarkTheme ? 'light' : 'dark')
  }

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    }
    return user?.email?.charAt(0).toUpperCase() || 'U'
  }

  return (
    <div className="flex-none w-full bg-neutral text-neutral-content z-50">
      <div className="navbar min-h-[48px] px-4">
        <div className="flex-none lg:hidden">
          <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>
        <div className="flex-1">
          <a href="/" target="_blank" className="btn btn-ghost btn-sm normal-case text-sm">
            <FiHome className="w-4 h-4 mr-1" />
            Visit Site
          </a>
        </div>
        <div className="flex-none gap-2">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleLightDark}
            className="btn btn-ghost btn-sm btn-circle"
            title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkTheme ? (
              <FiSun className="w-4 h-4" />
            ) : (
              <FiMoon className="w-4 h-4" />
            )}
          </button>

          {/* Theme Selector with Label */}
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-70">Theme:</span>
            <ThemeSelector />
          </div>

          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1 border-l border-base-content/20 pl-2 ml-2">
            <button
              onClick={decreaseFontSize}
              className="btn btn-ghost btn-sm btn-circle"
              title="Decrease Font Size"
              disabled={fontSize === 'text-sm'}
            >
              <span className="text-xs font-bold">A</span>
            </button>
            <button
              onClick={increaseFontSize}
              className="btn btn-ghost btn-sm btn-circle"
              title="Increase Font Size"
              disabled={fontSize === 'text-lg'}
            >
              <span className="text-lg font-bold">A</span>
            </button>
          </div>

          {/* User Menu */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                <span className="text-base font-semibold">{getInitials()}</span>
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content rounded-box w-52" style={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))', color: 'var(--fallback-bc,oklch(var(--bc)/1))' }}>
              <li className="menu-title">
                <span>{user?.email}</span>
              </li>
              <li><Link to="/admin/users/profile">Edit Profile</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
