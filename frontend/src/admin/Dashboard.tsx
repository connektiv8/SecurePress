import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'
import { FiFileText, FiFile, FiImage, FiUsers, FiTrendingUp, FiActivity } from 'react-icons/fi'

export default function Dashboard() {
  const stats = [
    { title: 'Total Posts', value: '124', icon: FiFileText, change: '+12%', color: 'primary' },
    { title: 'Total Pages', value: '18', icon: FiFile, change: '+3%', color: 'secondary' },
    { title: 'Media Files', value: '456', icon: FiImage, change: '+25%', color: 'accent' },
    { title: 'Users', value: '32', icon: FiUsers, change: '+8%', color: 'info' },
  ]

  const recentPosts = [
    { id: 1, title: 'Welcome to SecurePress', status: 'published', date: '2024-01-15' },
    { id: 2, title: 'Security Best Practices', status: 'draft', date: '2024-01-14' },
    { id: 3, title: 'Getting Started Guide', status: 'published', date: '2024-01-13' },
  ]

  return (
    <AdminSidebar>
      <Header title="Dashboard" />
      
      <div className="content-wrapper">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-base-content/70">Here's what's happening with your site today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.title} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base-content/60 text-sm">{stat.title}</p>
                      <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                      <div className="flex items-center gap-1 mt-2">
                        <FiTrendingUp className="w-4 h-4 text-success" />
                        <span className="text-success text-sm">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`bg-${stat.color}/10 p-3 rounded-lg`}>
                      <Icon className={`w-8 h-8 text-${stat.color}`} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Posts */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Recent Posts</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPosts.map((post) => (
                      <tr key={post.id}>
                        <td>{post.title}</td>
                        <td>
                          <span className={`badge ${post.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                            {post.status}
                          </span>
                        </td>
                        <td>{post.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-actions justify-end mt-4">
                <a href="/admin/posts" className="btn btn-primary btn-sm">View All</a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <a href="/admin/posts/new" className="btn btn-outline btn-primary">
                  <FiFileText className="mr-2" />
                  New Post
                </a>
                <a href="/admin/pages/new" className="btn btn-outline btn-secondary">
                  <FiFile className="mr-2" />
                  New Page
                </a>
                <a href="/admin/media" className="btn btn-outline btn-accent">
                  <FiImage className="mr-2" />
                  Upload Media
                </a>
                <a href="/admin/users" className="btn btn-outline btn-info">
                  <FiUsers className="mr-2" />
                  Manage Users
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <FiActivity className="text-success" />
              System Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">API Status</div>
                <div className="stat-value text-success text-2xl">Online</div>
                <div className="stat-desc">All systems operational</div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Database</div>
                <div className="stat-value text-success text-2xl">Healthy</div>
                <div className="stat-desc">PostgreSQL 18.1</div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Security</div>
                <div className="stat-value text-success text-2xl">Secure</div>
                <div className="stat-desc">All checks passed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
