import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'
import { FiDownload, FiPackage } from 'react-icons/fi'

export default function Themes() {
  const themes = [
    { id: 1, name: 'Default Theme', version: '1.0.0', active: true, screenshot: null },
  ]

  return (
    <AdminSidebar>
      <Header title="Themes" />
      <div className="content-wrapper">
        <div className="flex justify-between items-center mb-6">
          <p className="text-base-content/70">Manage your site's appearance with themes</p>
          <button className="btn btn-primary btn-sm">
            <FiDownload className="mr-2" />
            Add New Theme
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div key={theme.id} className="card bg-base-100 shadow-xl">
              <figure className="h-48 bg-base-300 flex items-center justify-center">
                <FiPackage className="w-16 h-16 text-base-content/30" />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-lg">
                  {theme.name}
                  {theme.active && <span className="badge badge-success badge-sm">Active</span>}
                </h3>
                <p className="text-sm text-base-content/70">Version {theme.version}</p>
                <div className="card-actions justify-end mt-4">
                  {!theme.active && <button className="btn btn-sm btn-primary">Activate</button>}
                  <button className="btn btn-sm btn-ghost">Customize</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminSidebar>
  )
}
