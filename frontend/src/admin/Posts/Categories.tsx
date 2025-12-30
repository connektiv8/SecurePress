import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'

export default function Categories() {
  return (
    <AdminSidebar>
      <Header title="Categories" />
      <div className="content-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Add New Category</h3>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input type="text" placeholder="Category name" className="input input-bordered" />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Slug</span>
                  </label>
                  <input type="text" placeholder="category-slug" className="input input-bordered" />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea className="textarea textarea-bordered" placeholder="Category description"></textarea>
                </div>
                
                <button className="btn btn-primary mt-4">Add Category</button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Categories</h3>
                
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
                        <td>Uncategorized</td>
                        <td>uncategorized</td>
                        <td className="text-sm text-base-content/70">Default category</td>
                        <td>0</td>
                        <td>
                          <button className="btn btn-xs btn-ghost">Edit</button>
                          <button className="btn btn-xs btn-ghost btn-error">Delete</button>
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
