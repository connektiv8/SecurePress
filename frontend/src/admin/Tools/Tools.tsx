import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'
import { FiDownload, FiUpload, FiActivity } from 'react-icons/fi'

export default function Tools() {
  return (
    <AdminSidebar>
      <Header title="Tools" />
      <div className="content-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <FiDownload className="w-12 h-12 text-primary mb-4" />
              <h3 className="card-title">Import</h3>
              <p className="text-sm text-base-content/70">
                Import content from WordPress, Shopify, or other platforms.
              </p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">Import Content</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <FiUpload className="w-12 h-12 text-secondary mb-4" />
              <h3 className="card-title">Export</h3>
              <p className="text-sm text-base-content/70">
                Export your content, settings, and media files.
              </p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-secondary btn-sm">Export Content</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <FiActivity className="w-12 h-12 text-accent mb-4" />
              <h3 className="card-title">Site Health</h3>
              <p className="text-sm text-base-content/70">
                Check your site's performance and security status.
              </p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-accent btn-sm">Check Status</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
