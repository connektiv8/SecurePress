import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'

export default function Comments() {
  return (
    <AdminSidebar>
      <Header title="Comments" />
      <div className="content-wrapper">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Comments Management</h2>
            <p className="text-base-content/70">Comment moderation and management coming soon.</p>
            
            <div className="overflow-x-auto mt-4">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Comment</th>
                    <th>In Response To</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="text-center text-base-content/50">
                      No comments yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
