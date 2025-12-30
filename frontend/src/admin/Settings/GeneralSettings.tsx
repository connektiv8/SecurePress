import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'

export default function GeneralSettings() {
  return (
    <AdminSidebar>
      <Header title="General Settings" />
      <div className="content-wrapper">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">General Settings</h2>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Site Title</span>
                </label>
                <input type="text" placeholder="SecurePress" className="input input-bordered" />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tagline</span>
                </label>
                <input type="text" placeholder="Just another SecurePress site" className="input input-bordered" />
                <label className="label">
                  <span className="label-text-alt">In a few words, explain what this site is about.</span>
                </label>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Site URL</span>
                </label>
                <input type="url" placeholder="https://example.com" className="input input-bordered" />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Admin Email Address</span>
                </label>
                <input type="email" placeholder="admin@example.com" className="input input-bordered" />
                <label className="label">
                  <span className="label-text-alt">This address is used for admin purposes.</span>
                </label>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Timezone</span>
                </label>
                <select className="select select-bordered">
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date Format</span>
                </label>
                <select className="select select-bordered">
                  <option>F j, Y (January 1, 2024)</option>
                  <option>Y-m-d (2024-01-01)</option>
                  <option>m/d/Y (01/01/2024)</option>
                  <option>d/m/Y (01/01/2024)</option>
                </select>
              </div>
            </div>
            
            <div className="card-actions justify-end mt-6">
              <button className="btn btn-ghost">Cancel</button>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
