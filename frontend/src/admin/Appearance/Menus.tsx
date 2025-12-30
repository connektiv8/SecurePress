import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'
import { FiPlus, FiMove, FiChevronDown, FiChevronRight, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface MenuItem {
  id: string
  label: string
  url?: string
  type: 'page' | 'post' | 'category' | 'custom'
  children?: MenuItem[]
  parentId?: string
}

interface AvailableItem {
  id: string
  label: string
  type: 'page' | 'post' | 'category'
  url: string
}

// Sortable menu item with nesting support
function SortableMenuItem({ 
  item, 
  depth = 0, 
  onRemove, 
  onEdit,
  onToggleExpand,
  expandedItems 
}: { 
  item: MenuItem
  depth?: number
  onRemove: (id: string) => void
  onEdit: (id: string) => void
  onToggleExpand: (id: string) => void
  expandedItems: Set<string>
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginLeft: `${depth * 24}px`,
  }

  const hasChildren = item.children && item.children.length > 0
  const isExpanded = expandedItems.has(item.id)

  return (
    <div ref={setNodeRef} style={style}>
      <div className="p-3 bg-base-200 rounded-lg flex items-center gap-3 mb-2">
        <div {...listeners} {...attributes} className="cursor-move">
          <FiMove className="text-base-content/50" />
        </div>
        
        {hasChildren && (
          <button 
            onClick={() => onToggleExpand(item.id)}
            className="btn btn-xs btn-ghost"
          >
            {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        )}
        
        <span className="flex-1">{item.label}</span>
        
        {item.url && (
          <span className="text-xs text-base-content/50">{item.url}</span>
        )}
        
        <button 
          onClick={() => onEdit(item.id)} 
          className="btn btn-xs btn-ghost"
        >
          <FiEdit2 />
        </button>
        <button 
          onClick={() => onRemove(item.id)} 
          className="btn btn-xs btn-ghost text-error"
        >
          <FiTrash2 />
        </button>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="ml-6">
          {item.children!.map((child) => (
            <SortableMenuItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onRemove={onRemove}
              onEdit={onEdit}
              onToggleExpand={onToggleExpand}
              expandedItems={expandedItems}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Menus() {
  // Mock data for available items
  const [availablePages] = useState<AvailableItem[]>([
    { id: 'page-1', label: 'Home', type: 'page', url: '/' },
    { id: 'page-2', label: 'About', type: 'page', url: '/about' },
    { id: 'page-3', label: 'Contact', type: 'page', url: '/contact' },
    { id: 'page-4', label: 'Services', type: 'page', url: '/services' },
    { id: 'page-5', label: 'Blog', type: 'page', url: '/blog' },
  ])

  const [availablePosts] = useState<AvailableItem[]>([
    { id: 'post-1', label: 'Getting Started', type: 'post', url: '/blog/getting-started' },
    { id: 'post-2', label: 'Best Practices', type: 'post', url: '/blog/best-practices' },
    { id: 'post-3', label: 'Advanced Tips', type: 'post', url: '/blog/advanced-tips' },
  ])

  const [availableCategories] = useState<AvailableItem[]>([
    { id: 'cat-1', label: 'News', type: 'category', url: '/category/news' },
    { id: 'cat-2', label: 'Tutorials', type: 'category', url: '/category/tutorials' },
    { id: 'cat-3', label: 'Updates', type: 'category', url: '/category/updates' },
  ])

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [customLinkUrl, setCustomLinkUrl] = useState('')
  const [customLinkText, setCustomLinkText] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draggedOverId, setDraggedOverId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const addSelectedToMenu = (items: AvailableItem[]) => {
    const itemsToAdd = items
      .filter(item => selectedItems.has(item.id))
      .map(item => ({
        id: `menu-${item.id}-${Date.now()}`,
        label: item.label,
        url: item.url,
        type: item.type,
        children: []
      }))

    setMenuItems(prev => [...prev, ...itemsToAdd])
    setSelectedItems(new Set())
  }

  const addCustomLink = () => {
    if (!customLinkUrl || !customLinkText) return

    const newItem: MenuItem = {
      id: `custom-${Date.now()}`,
      label: customLinkText,
      url: customLinkUrl,
      type: 'custom',
      children: []
    }

    setMenuItems(prev => [...prev, newItem])
    setCustomLinkUrl('')
    setCustomLinkText('')
  }

  const removeItem = (id: string) => {
    const removeRecursive = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter(item => item.id !== id)
        .map(item => ({
          ...item,
          children: item.children ? removeRecursive(item.children) : []
        }))
    }
    setMenuItems(removeRecursive(menuItems))
  }

  const editItem = (id: string) => {
    // TODO: Implement edit modal
    console.log('Edit item:', id)
  }

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setMenuItems((items) => {
        const flattenItems = (items: MenuItem[]): MenuItem[] => {
          return items.reduce((acc, item) => {
            return [...acc, item, ...(item.children ? flattenItems(item.children) : [])]
          }, [] as MenuItem[])
        }

        const allItems = flattenItems(items)
        const oldIndex = allItems.findIndex(item => item.id === active.id)
        const newIndex = allItems.findIndex(item => item.id === over.id)

        // For now, just reorder at the top level
        // TODO: Implement proper nesting logic
        const topLevelItems = items.filter(item => !item.parentId)
        const oldTopIndex = topLevelItems.findIndex(item => item.id === active.id)
        const newTopIndex = topLevelItems.findIndex(item => item.id === over.id)

        if (oldTopIndex !== -1 && newTopIndex !== -1) {
          return arrayMove(topLevelItems, oldTopIndex, newTopIndex)
        }

        return items
      })
    }

    setActiveId(null)
    setDraggedOverId(null)
  }

  return (
    <AdminSidebar>
      <Header title="Menus" />
      <div className="content-wrapper">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Available Items */}
            <div className="lg:col-span-1 space-y-4">
              {/* Pages */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-sm">Pages</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availablePages.map(page => (
                      <label 
                        key={page.id} 
                        className="label cursor-pointer justify-start gap-2"
                      >
                        <input 
                          type="checkbox" 
                          className="checkbox checkbox-sm"
                          checked={selectedItems.has(page.id)}
                          onChange={() => toggleSelection(page.id)}
                        />
                        <span className="label-text">{page.label}</span>
                      </label>
                    ))}
                  </div>
                  <button 
                    className="btn btn-sm btn-outline mt-2"
                    onClick={() => addSelectedToMenu(availablePages)}
                    disabled={selectedItems.size === 0}
                  >
                    <FiPlus className="mr-1" />
                    Add to Menu ({selectedItems.size})
                  </button>
                </div>
              </div>

              {/* Posts */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-sm">Posts</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availablePosts.map(post => (
                      <label 
                        key={post.id} 
                        className="label cursor-pointer justify-start gap-2"
                      >
                        <input 
                          type="checkbox" 
                          className="checkbox checkbox-sm"
                          checked={selectedItems.has(post.id)}
                          onChange={() => toggleSelection(post.id)}
                        />
                        <span className="label-text">{post.label}</span>
                      </label>
                    ))}
                  </div>
                  <button 
                    className="btn btn-sm btn-outline mt-2"
                    onClick={() => addSelectedToMenu(availablePosts)}
                    disabled={selectedItems.size === 0}
                  >
                    <FiPlus className="mr-1" />
                    Add to Menu ({selectedItems.size})
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-sm">Categories</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableCategories.map(cat => (
                      <label 
                        key={cat.id} 
                        className="label cursor-pointer justify-start gap-2"
                      >
                        <input 
                          type="checkbox" 
                          className="checkbox checkbox-sm"
                          checked={selectedItems.has(cat.id)}
                          onChange={() => toggleSelection(cat.id)}
                        />
                        <span className="label-text">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                  <button 
                    className="btn btn-sm btn-outline mt-2"
                    onClick={() => addSelectedToMenu(availableCategories)}
                    disabled={selectedItems.size === 0}
                  >
                    <FiPlus className="mr-1" />
                    Add to Menu ({selectedItems.size})
                  </button>
                </div>
              </div>
              
              {/* Custom Links */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-sm">Custom Links</h3>
                  <div className="form-control">
                    <input 
                      type="text" 
                      placeholder="URL" 
                      className="input input-sm input-bordered mb-2"
                      value={customLinkUrl}
                      onChange={(e) => setCustomLinkUrl(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Link Text" 
                      className="input input-sm input-bordered"
                      value={customLinkText}
                      onChange={(e) => setCustomLinkText(e.target.value)}
                    />
                  </div>
                  <button 
                    className="btn btn-sm btn-outline mt-2"
                    onClick={addCustomLink}
                    disabled={!customLinkUrl || !customLinkText}
                  >
                    <FiPlus className="mr-1" />
                    Add to Menu
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Panel - Menu Structure */}
            <div className="lg:col-span-2">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="card-title">Primary Menu</h3>
                    <select className="select select-sm select-bordered">
                      <option>Primary Menu</option>
                      <option>Footer Menu</option>
                      <option>Social Menu</option>
                    </select>
                  </div>
                  
                  {menuItems.length === 0 ? (
                    <div className="text-center py-12 text-base-content/50">
                      <p>No menu items yet.</p>
                      <p className="text-sm mt-2">Select items from the left and click "Add to Menu"</p>
                    </div>
                  ) : (
                    <SortableContext
                      items={menuItems.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {menuItems.map((item) => (
                          <SortableMenuItem
                            key={item.id}
                            item={item}
                            onRemove={removeItem}
                            onEdit={editItem}
                            onToggleExpand={toggleExpand}
                            expandedItems={expandedItems}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  )}
                  
                  <div className="card-actions justify-end mt-6">
                    <button className="btn btn-ghost">Cancel</button>
                    <button className="btn btn-primary">Save Menu</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DndContext>
      </div>
    </AdminSidebar>
  )
}
