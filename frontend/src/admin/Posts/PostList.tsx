import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Sidebar from '@/components/Layout/Sidebar'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch } from 'react-icons/fi'
import { getPosts, deletePost } from '@/services/postApi'
import type { Post } from '@/types'

export default function PostList() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // Fetch posts
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', page, statusFilter, searchQuery],
    queryFn: () => getPosts({ 
      page, 
      status: statusFilter as any || undefined,
      search: searchQuery || undefined 
    }),
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (slug: string) => deletePost(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleDelete = async (post: Post) => {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await deleteMutation.mutateAsync(post.slug)
      } catch (error: any) {
        alert(error.message || 'Failed to delete post')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'badge-success'
      case 'draft': return 'badge-warning'
      case 'scheduled': return 'badge-info'
      case 'archived': return 'badge-error'
      default: return 'badge-ghost'
    }
  }

  return (
    <Sidebar>
      <Header title="Posts" />
      
      <div className="content-wrapper">
        {/* Header with actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Posts</h1>
            <p className="text-base-content/70">Manage your blog posts</p>
          </div>
          <Link to="/admin/posts/new" className="btn btn-primary gap-2">
            <FiPlus /> New Post
          </Link>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="form-control">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="input input-bordered w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-square">
                    <FiSearch />
                  </button>
                </div>
              </div>

              {/* Status filter */}
              <div className="form-control">
                <select
                  className="select select-bordered w-full"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Clear filters */}
              {(searchQuery || statusFilter) && (
                <div className="form-control">
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      setSearchQuery('')
                      setStatusFilter('')
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {isLoading && (
              <div className="text-center py-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <span>Error loading posts. Please try again.</span>
              </div>
            )}

            {!isLoading && !error && data && (
              <>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.results.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-base-content/60">
                            No posts found. Create your first post!
                          </td>
                        </tr>
                      ) : (
                        data.results.map((post) => (
                          <tr key={post.id}>
                            <td>
                              <div>
                                <div className="font-semibold">{post.title}</div>
                                {post.excerpt && (
                                  <div className="text-sm text-base-content/60 truncate max-w-md">
                                    {post.excerpt}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>{post.author.full_name || post.author.email}</td>
                            <td>
                              <span className={`badge ${getStatusColor(post.status)}`}>
                                {post.status}
                              </span>
                            </td>
                            <td>
                              <div className="flex items-center gap-1">
                                <FiEye className="w-4 h-4" />
                                {post.view_count}
                              </div>
                            </td>
                            <td>
                              <div className="text-sm">
                                {new Date(post.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td>
                              <div className="flex gap-2">
                                <Link
                                  to={`/admin/posts/${post.slug}`}
                                  className="btn btn-sm btn-ghost"
                                  title="Edit"
                                >
                                  <FiEdit />
                                </Link>
                                <button
                                  onClick={() => handleDelete(post)}
                                  className="btn btn-sm btn-ghost text-error"
                                  title="Delete"
                                  disabled={deleteMutation.isPending}
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {data.results.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-base-content/60">
                      Showing {data.results.length} of {data.count} posts
                    </div>
                    <div className="join">
                      <button
                        className="join-item btn btn-sm"
                        onClick={() => setPage(page - 1)}
                        disabled={!data.previous || isLoading}
                      >
                        «
                      </button>
                      <button className="join-item btn btn-sm">
                        Page {page}
                      </button>
                      <button
                        className="join-item btn btn-sm"
                        onClick={() => setPage(page + 1)}
                        disabled={!data.next || isLoading}
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </Sidebar>
  )
}
