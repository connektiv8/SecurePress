import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  FiHome, FiFileText, FiFile, FiImage, FiMessageSquare, FiUsers,
  FiLayout, FiPackage, FiTool, FiSettings, FiChevronDown,
  FiChevronRight, FiPlusCircle, FiList, FiGrid, FiEdit3, FiFolder,
  FiUser, FiDownload, FiUpload, FiActivity, FiLink, FiShield, FiShoppingCart
} from 'react-icons/fi'
import SecurePressLogo from '@/components/Logo'

interface MenuItem {
  path?: string
  icon: any
  label: string
  badge?: string | number
  submenu?: {
    path: string
    label: string
    icon?: any
  }[]
}

export default function SidebarMenu() {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['posts', 'pages', 'appearance'])

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(k => k !== menuKey)
        : [...prev, menuKey]
    )
  }

  // WordPress-style menu structure
  const menuSections: { [key: string]: MenuItem } = {
    dashboard: {
      path: '/admin',
      icon: FiHome,
      label: 'Dashboard'
    },
    posts: {
      icon: FiFileText,
      label: 'Posts',
      badge: '5',
      submenu: [
        { path: '/admin/posts', label: 'All Posts', icon: FiList },
        { path: '/admin/posts/new', label: 'Add New', icon: FiPlusCircle },
        { path: '/admin/posts/categories', label: 'Categories', icon: FiFolder },
        { path: '/admin/posts/tags', label: 'Tags', icon: FiGrid },
      ]
    },
    products: {
      path: '/admin/products',
      icon: FiShoppingCart,
      label: 'Products'
    },
    media: {
      path: '/admin/media',
      icon: FiImage,
      label: 'Media',
      submenu: [
        { path: '/admin/media', label: 'Library', icon: FiList },
        { path: '/admin/media/upload', label: 'Add New', icon: FiPlusCircle },
      ]
    },
    pages: {
      icon: FiFile,
      label: 'Pages',
      submenu: [
        { path: '/admin/pages', label: 'All Pages', icon: FiList },
        { path: '/admin/pages/new', label: 'Add New', icon: FiPlusCircle },
        { path: '/admin/appearance/page-templates', label: 'Page Templates', icon: FiLayout },
      ]
    },
    comments: {
      path: '/admin/comments',
      icon: FiMessageSquare,
      label: 'Comments',
      badge: '12'
    },
    appearance: {
      icon: FiLayout,
      label: 'Appearance',
      submenu: [
        { path: '/admin/appearance/themes', label: 'Themes', icon: FiGrid },
        { path: '/admin/appearance/customize', label: 'Customize', icon: FiEdit3 },
        { path: '/admin/appearance/widgets', label: 'Widgets', icon: FiGrid },
        { path: '/admin/appearance/menus', label: 'Menus', icon: FiList },
      ]
    },
    plugins: {
      icon: FiPackage,
      label: 'Plugins',
      submenu: [
        { path: '/admin/plugins', label: 'Installed Plugins', icon: FiList },
        { path: '/admin/plugins/add', label: 'Add New', icon: FiPlusCircle },
      ]
    },
    users: {
      icon: FiUsers,
      label: 'Users',
      submenu: [
        { path: '/admin/users', label: 'All Users', icon: FiList },
        { path: '/admin/users/new', label: 'Add New', icon: FiPlusCircle },
        { path: '/admin/users/profile', label: 'Your Profile', icon: FiUser },
      ]
    },
    tools: {
      icon: FiTool,
      label: 'Tools',
      submenu: [
        { path: '/admin/tools/import', label: 'Import', icon: FiDownload },
        { path: '/admin/tools/export', label: 'Export', icon: FiUpload },
        { path: '/admin/tools/health', label: 'Site Health', icon: FiActivity },
      ]
    },
    settings: {
      icon: FiSettings,
      label: 'Settings',
      submenu: [
        { path: '/admin/settings/general', label: 'General', icon: FiSettings },
        { path: '/admin/settings/writing', label: 'Writing', icon: FiEdit3 },
        { path: '/admin/settings/reading', label: 'Reading', icon: FiFileText },
        { path: '/admin/settings/discussion', label: 'Discussion', icon: FiMessageSquare },
        { path: '/admin/settings/media', label: 'Media', icon: FiImage },
        { path: '/admin/settings/permalinks', label: 'Permalinks', icon: FiLink },
        { path: '/admin/settings/privacy', label: 'Privacy', icon: FiShield },
      ]
    }
  }

  // Auto-expand menus when navigating to their child routes
  useEffect(() => {
    Object.entries(menuSections).forEach(([key, item]) => {
      if (item.submenu) {
        const hasActiveChild = item.submenu.some(sub => 
          location.pathname === sub.path || location.pathname.startsWith(sub.path + '/')
        )
        if (hasActiveChild && !expandedMenus.includes(key)) {
          setExpandedMenus(prev => [...prev, key])
        }
      }
    })
  }, [location.pathname])

  const isMenuActive = (menuKey: string, item: MenuItem) => {
    if (item.path && location.pathname === item.path) return true
    if (item.submenu) {
      return item.submenu.some(sub => location.pathname === sub.path)
    }
    return false
  }

  const isSubmenuItemActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <aside className="bg-neutral text-neutral-content min-h-full w-64">
      {/* Logo Section */}
      <div className="p-4 bg-neutral-focus">
        <Link to="/admin" className="flex items-center gap-3">
          <SecurePressLogo size={40} className="text-primary" />
          <div>
            <h1 className="text-lg font-bold">SecurePress</h1>
            <p className="text-xs opacity-70">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2">
        <ul className="menu menu-compact gap-1">
          {Object.entries(menuSections).map(([key, item]) => (
            <li key={key}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(key)}
                    className="flex items-center justify-between hover:bg-base-content/10"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="badge badge-sm badge-primary">{item.badge}</span>
                      )}
                    </div>
                    {expandedMenus.includes(key) ? (
                      <FiChevronDown className="w-3 h-3" />
                    ) : (
                      <FiChevronRight className="w-3 h-3" />
                    )}
                  </button>
                  {expandedMenus.includes(key) && (
                    <ul className="ml-2">
                      {item.submenu.map((subItem) => {
                        const isActive = isSubmenuItemActive(subItem.path);
                        return (
                          <li key={subItem.path}>
                            <Link
                              to={subItem.path}
                              className="flex items-center gap-2 text-sm hover:bg-base-content/10"
                              style={isActive ? { backgroundColor: 'var(--fallback-bc,oklch(var(--bc)/0.1))' } : undefined}
                            >
                              {subItem.icon && <subItem.icon className="w-3 h-3" />}
                              <span>{subItem.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.path!}
                  className="flex items-center gap-2 hover:bg-base-content/10"
                  style={location.pathname === item.path ? { backgroundColor: 'var(--fallback-bc,oklch(var(--bc)/0.1))' } : undefined}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="badge badge-sm badge-primary">{item.badge}</span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 text-center border-t border-neutral-focus">
        <p className="text-xs opacity-50">SecurePress v1.0.0</p>
      </div>
    </aside>
  )
}
