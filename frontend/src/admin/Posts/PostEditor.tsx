import Sidebar from '@/components/Layout/Sidebar'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

export default function PostEditor() {
  return (
    <Sidebar>
      <Header title="Edit Post" />
      <div className="content-wrapper">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4">Post Editor</h2>
            <p className="text-base-content/70">Rich text editor will be implemented here.</p>
          </div>
        </div>
      </div>
      <Footer />
    </Sidebar>
  )
}
