import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiFileText, FiFile, FiImage, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  children?: React.ReactNode
}

export default function Sidebar({ children }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/posts', icon: FiFileText, label: 'Posts' },
    { path: '/admin/pages', icon: FiFile, label: 'Pages' },
    { path: '/admin/media', icon: FiImage, label: 'Media' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ]

  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar for mobile */}
        <div className="w-full navbar bg-base-100 lg:hidden">
          <div className="flex-none">
            <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold">SecurePress</span>
          </div>
        </div>
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="bg-base-100 text-base-content min-h-full w-64 p-4">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SecurePress
            </h1>
            <p className="text-xs text-base-content/60 mt-1">Admin Dashboard</p>
          </div>

          {/* Navigation Menu */}
          <ul className="menu menu-compact gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || 
                             (item.path !== '/admin' && location.pathname.startsWith(item.path))
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={isActive ? 'active' : ''}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Logout */}
          <div className="mt-auto pt-4 border-t border-base-300">
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-block justify-start"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
