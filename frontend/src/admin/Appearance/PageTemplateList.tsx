import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '@/components/Layout/AdminSidebar'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiCopy, FiGrid, FiList } from 'react-icons/fi'

interface PageTemplate {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  widgets_count: number
}

// Mock data - replace with API call
const mockTemplates: PageTemplate[] = [
  {
    id: 1,
    name: 'Homepage',
    description: 'Default homepage layout with hero, features, and CTA',
    created_at: '2024-01-15',
    updated_at: '2024-01-20',
    widgets_count: 8
  },
  {
    id: 2,
    name: 'About Page',
    description: 'Standard about page with team section and testimonials',
    created_at: '2024-01-16',
    updated_at: '2024-01-18',
    widgets_count: 6
  },
  {
    id: 3,
    name: 'Contact',
    description: 'Contact page with form and location map',
    created_at: '2024-01-17',
    updated_at: '2024-01-17',
    widgets_count: 4
  },
]

export default function PageTemplateList() {
  const [templates] = useState<PageTemplate[]>(mockTemplates)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handleDelete = (template: PageTemplate) => {
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      // TODO: Implement delete
      alert('Delete functionality pending')
    }
  }

  const handleDuplicate = (template: PageTemplate) => {
    // TODO: Implement duplicate
    alert('Duplicate functionality pending')
  }

  return (
    <AdminSidebar>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Page Templates</h1>
            <p className="text-base-content/70">Design reusable page layouts with drag-and-drop blocks</p>
          </div>
          <div className="flex gap-2">
            {/* View Toggle */}
            <div className="btn-group">
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-active' : 'btn-ghost'}`}
                title="Grid View"
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-active' : 'btn-ghost'}`}
                title="List View"
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
            <Link to="/admin/appearance/page-templates/new" className="btn btn-primary gap-2">
              <FiPlus /> New Template
            </Link>
          </div>
        </div>

        {/* Templates Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {templates.map((template) => (
            viewMode === 'grid' ? (
              <div key={template.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  <h2 className="card-title">{template.name}</h2>
                  <p className="text-sm text-base-content/70 mb-2">{template.description}</p>
                  
                  <div className="flex gap-2 text-xs text-base-content/50 mb-4">
                    <span>{template.widgets_count} widgets</span>
                    <span>•</span>
                    <span>Updated {new Date(template.updated_at).toLocaleDateString()}</span>
                  </div>

                  <div className="card-actions justify-end">
                    <button
                      onClick={() => handleDuplicate(template)}
                      className="btn btn-ghost btn-sm gap-1"
                      title="Duplicate"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/admin/appearance/page-templates/${template.id}/preview`}
                      className="btn btn-ghost btn-sm gap-1"
                      title="Preview"
                    >
                      <FiEye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/appearance/page-templates/${template.id}`}
                      className="btn btn-primary btn-sm gap-1"
                    >
                      <FiEdit className="w-4 h-4" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(template)}
                      className="btn btn-error btn-sm gap-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div key={template.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{template.name}</h3>
                      <p className="text-sm text-base-content/70">{template.description}</p>
                      <div className="flex gap-3 text-xs text-base-content/50 mt-2">
                        <span>{template.widgets_count} widgets</span>
                        <span>•</span>
                        <span>Updated {new Date(template.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDuplicate(template)}
                        className="btn btn-ghost btn-sm gap-1"
                        title="Duplicate"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/admin/appearance/page-templates/${template.id}/preview`}
                        className="btn btn-ghost btn-sm gap-1"
                        title="Preview"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/appearance/page-templates/${template.id}`}
                        className="btn btn-primary btn-sm gap-1"
                      >
                        <FiEdit className="w-4 h-4" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(template)}
                        className="btn btn-error btn-sm gap-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}

          {/* Empty State */}
          {templates.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-base-content/50 mb-4">
                <FiPlus className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">No templates yet</p>
                <p className="text-sm">Create your first page template to get started</p>
              </div>
              <Link to="/admin/appearance/page-templates/new" className="btn btn-primary gap-2 mt-4">
                <FiPlus /> Create Template
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminSidebar>
  )
}
