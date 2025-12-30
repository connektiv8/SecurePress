import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'

export default function Customize() {
  return (
    <AdminSidebar>
      <Header title="Customize" />
      <div className="content-wrapper">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Theme Customizer</h2>
            <p className="text-base-content/70">Live theme customization with real-time preview.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Site Title</span>
                  </label>
                  <input type="text" placeholder="SecurePress" className="input input-bordered" />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Site Tagline</span>
                  </label>
                  <input type="text" placeholder="Just another SecurePress site" className="input input-bordered" />
                </div>
                
                <div className="divider">Colours</div>
                
                <div className="flex gap-6 justify-start">
                  <div className="form-control items-center">
                    <label className="label">
                      <span className="label-text text-sm">Primary</span>
                    </label>
                    <input type="color" className="h-12 w-12 rounded-lg cursor-pointer" style={{ border: 'none' }} />
                  </div>
                  
                  <div className="form-control items-center">
                    <label className="label">
                      <span className="label-text text-sm">Secondary</span>
                    </label>
                    <input type="color" className="h-12 w-12 rounded-lg cursor-pointer" style={{ border: 'none' }} />
                  </div>
                  
                  <div className="form-control items-center">
                    <label className="label">
                      <span className="label-text text-sm">Tertiary</span>
                    </label>
                    <input type="color" className="h-12 w-12 rounded-lg cursor-pointer" style={{ border: 'none' }} />
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2 bg-base-200 rounded-lg p-4 flex items-center justify-center">
                <p className="text-base-content/50">Live Preview Area</p>
              </div>
            </div>
            
            <div className="card-actions justify-end mt-6">
              <button className="btn btn-ghost">Cancel</button>
              <button className="btn btn-primary">Publish</button>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
