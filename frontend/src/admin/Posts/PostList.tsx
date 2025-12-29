import Sidebar from '@/components/Layout/Sidebar'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

export default function PostList() {
  return (
    <Sidebar>
      <Header title="Posts" />
      <div className="content-wrapper">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4">All Posts</h2>
            <p className="text-base-content/70">Post management will be implemented here.</p>
            <a href="/admin/posts/new" className="btn btn-primary mt-4 w-fit">Create New Post</a>
          </div>
        </div>
      </div>
      <Footer />
    </Sidebar>
  )
}
