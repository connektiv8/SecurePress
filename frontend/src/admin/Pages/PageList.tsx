import Sidebar from '@/components/Layout/Sidebar'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

export default function PageList() {
  return (
    <Sidebar>
      <Header title="Pages" />
      <div className="content-wrapper">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4">All Pages</h2>
            <p className="text-base-content/70">Page management will be implemented here.</p>
            <a href="/admin/pages/new" className="btn btn-primary mt-4 w-fit">Create New Page</a>
          </div>
        </div>
      </div>
      <Footer />
    </Sidebar>
  )
}
