import Sidebar from '@/components/Layout/Sidebar'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

export default function PageEditor() {
  return (
    <Sidebar>
      <Header title="Edit Page" />
      <div className="content-wrapper">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4">Page Editor</h2>
            <p className="text-base-content/70">Page editor will be implemented here.</p>
          </div>
        </div>
      </div>
      <Footer />
    </Sidebar>
  )
}
