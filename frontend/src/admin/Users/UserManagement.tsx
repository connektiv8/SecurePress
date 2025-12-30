import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'

export default function UserManagement() {
  return (
    <AdminSidebar>
      <Header title="Users" />
      <div className="content-wrapper">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className="text-base-content/70">User management will be implemented here.</p>
            <button className="btn btn-primary mt-4 w-fit">Add New User</button>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
