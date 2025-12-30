/**
 * WordPress-style Admin Layout
 * 
 * Provides familiar navigation structure matching WordPress admin for easy adoption
 */

import TopNavbar from './TopNavbar'
import SidebarMenu from './SidebarMenu'

interface SidebarProps {
  children?: React.ReactNode
}

export default function AdminSidebar({ children }: SidebarProps) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col h-screen bg-base-200">
        {/* Top Admin Bar (WordPress-style) */}
        <TopNavbar />

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side z-40">
        <label htmlFor="sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <SidebarMenu />
      </div>
    </div>
  )
}
