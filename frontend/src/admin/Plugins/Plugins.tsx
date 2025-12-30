import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'
import { FiPackage, FiDownload, FiToggleLeft, FiTrash2 } from 'react-icons/fi'

export default function Plugins() {
  const plugins = [
    { 
      id: 1, 
      name: 'SecureCommerce', 
      description: 'Advanced e-commerce functionality for SecurePress',
      version: '1.0.0',
      active: false 
    },
  ]

  return (
    <AdminSidebar>
      <Header title="Plugins" />
      <div className="content-wrapper">
        <div className="flex justify-between items-center mb-6">
          <p className="text-base-content/70">Extend your site with plugins</p>
          <button className="btn btn-primary btn-sm">
            <FiDownload className="mr-2" />
            Add New Plugin
          </button>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Plugin</th>
                    <th>Description</th>
                    <th>Version</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plugins.map((plugin) => (
                    <tr key={plugin.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <FiPackage className="w-8 h-8 text-primary" />
                          <div>
                            <div className="font-bold">{plugin.name}</div>
                            {plugin.active && <span className="badge badge-success badge-sm">Active</span>}
                          </div>
                        </div>
                      </td>
                      <td className="text-sm text-base-content/70">{plugin.description}</td>
                      <td>{plugin.version}</td>
                      <td>
                        <div className="flex gap-2">
                          <button className={`btn btn-sm ${plugin.active ? 'btn-warning' : 'btn-success'}`}>
                            <FiToggleLeft className="mr-1" />
                            {plugin.active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button className="btn btn-sm btn-ghost btn-error">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
