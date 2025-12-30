import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'
import { FiSave, FiX } from 'react-icons/fi'
import { getPost, createPost, updatePost } from '@/services/postApi'
import type { CreatePostData } from '@/types'

export default function PostEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    allow_comments: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch existing post if editing
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id!),
    enabled: isEditMode,
  })

  // Update form when post loads
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status,
        meta_description: post.meta_description,
        meta_keywords: post.meta_keywords,
        allow_comments: post.allow_comments,
      })
    }
  }, [post])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onSuccess: () => {
      navigate('/admin/posts')
    },
    onError: (error: any) => {
      if (error.data) {
        setErrors(error.data)
      }
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: CreatePostData) => updatePost(id!, data),
    onSuccess: () => {
      navigate('/admin/posts')
    },
    onError: (error: any) => {
      if (error.data) {
        setErrors(error.data)
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (isEditMode) {
      await updateMutation.mutateAsync(formData)
    } else {
      await createMutation.mutateAsync(formData)
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  if (isEditMode && isLoading) {
    return (
      <AdminSidebar>
        <Header title="Loading..." />
        <div className="content-wrapper">
          <div className="flex justify-center items-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </AdminSidebar>
    )
  }

  return (
    <AdminSidebar>
      <div className="h-full flex flex-col overflow-hidden">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Header with actions */}
          <div className="flex justify-between items-center px-8 py-6 bg-base-100 flex-shrink-0">
            <div>
              <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
              <p className="text-base-content/70">Fill in the details below</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/admin/posts')}
                className="btn btn-ghost gap-2"
              >
                <FiX /> Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary gap-2 ${isSaving ? 'loading' : ''}`}
                disabled={isSaving}
              >
                {!isSaving && <FiSave />}
                {isSaving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Main content - wider area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-base-200">
              {/* Title */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Title *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter post title..."
                      className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                    {errors.title && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.title}</span>
                      </label>
                    )}
                  </div>

                  {/* Slug */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Slug</span>
                      <span className="label-text-alt">Auto-generated if left empty</span>
                    </label>
                    <input
                      type="text"
                      placeholder="post-slug"
                      className="input input-bordered w-full"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Content *</span>
                    </label>
                    <textarea
                      placeholder="Write your post content here..."
                      className={`textarea textarea-bordered h-96 ${errors.content ? 'textarea-error' : ''}`}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                    />
                    {errors.content && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.content}</span>
                      </label>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Excerpt</span>
                      <span className="label-text-alt">Short description</span>
                    </label>
                    <textarea
                      placeholder="Brief summary of the post..."
                      className="textarea textarea-bordered h-24"
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">SEO Settings</h3>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Meta Description</span>
                    </label>
                    <textarea
                      placeholder="Meta description for search engines..."
                      className="textarea textarea-bordered h-20"
                      value={formData.meta_description || ''}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      maxLength={160}
                    />
                    <label className="label">
                      <span className="label-text-alt">{(formData.meta_description || '').length}/160 characters</span>
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Meta Keywords</span>
                    </label>
                    <input
                      type="text"
                      placeholder="keyword1, keyword2, keyword3"
                      className="input input-bordered w-full"
                      value={formData.meta_keywords || ''}
                      onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - narrower, fixed width */}
            <div className="w-96 p-6 space-y-6 bg-base-100 overflow-hidden">
              {/* Publish */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg">Publish</h3>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Status</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={formData.allow_comments}
                        onChange={(e) => setFormData({ ...formData, allow_comments: e.target.checked })}
                      />
                      <span className="label-text">Allow Comments</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Featured Image - Placeholder */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg">Featured Image</h3>
                  <div className="text-sm text-base-content/60">
                    Image upload coming soon
                  </div>
                </div>
              </div>

              {/* Categories & Tags - Placeholder */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg">Categories & Tags</h3>
                  <div className="text-sm text-base-content/60">
                    Category and tag management coming soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminSidebar>
  )
}
