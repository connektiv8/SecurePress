import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'

export default function Tags() {
  return (
    <AdminSidebar>
      <Header title="Tags" />
      <div className="content-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Add New Tag</h3>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input type="text" placeholder="Tag name" className="input input-bordered" />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Slug</span>
                  </label>
                  <input type="text" placeholder="tag-slug" className="input input-bordered" />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea className="textarea textarea-bordered" placeholder="Tag description"></textarea>
                </div>
                
                <button className="btn btn-primary mt-4">Add Tag</button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Tags</h3>
                
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Description</th>
                        <th>Count</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={5} className="text-center text-base-content/50">
                          No tags yet
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
