import { useState } from 'react'
import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FiMenu, FiX } from 'react-icons/fi'

interface Widget {
  id: string
  name: string
}

const availableWidgets: Widget[] = [
  { id: 'recent-posts', name: 'Recent Posts' },
  { id: 'categories', name: 'Categories' },
  { id: 'tags', name: 'Tags' },
  { id: 'search', name: 'Search' },
  { id: 'calendar', name: 'Calendar' },
  { id: 'archives', name: 'Archives' },
]

function SortableWidget({ widget, onRemove }: { widget: Widget; onRemove?: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <FiMenu className="w-4 h-4 text-base-content/50" />
      </div>
      <span className="flex-1">{widget.name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="btn btn-ghost btn-xs btn-circle"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function DraggableWidget({ widget }: { widget: Widget }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 bg-base-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-base-300 transition-colors"
    >
      {widget.name}
    </div>
  )
}

function DroppableArea({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  
  return (
    <div
      ref={setNodeRef}
      className={`border-2 border-dashed rounded-lg p-4 min-h-[200px] space-y-2 transition-colors ${
        isOver ? 'border-primary bg-primary/5' : 'border-base-300'
      }`}
    >
      {children}
    </div>
  )
}

export default function Widgets() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sidebarWidgets, setSidebarWidgets] = useState<Widget[]>([])
  const [footerWidgets, setFooterWidgets] = useState<Widget[]>([])
  const [available, setAvailable] = useState<Widget[]>(availableWidgets)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeWidget = available.find((w) => w.id === active.id) ||
                         sidebarWidgets.find((w) => w.id === active.id) ||
                         footerWidgets.find((w) => w.id === active.id)

    if (!activeWidget) return

    // Handle drops to sidebar
    if (over.id === 'sidebar-drop') {
      if (sidebarWidgets.find((w) => w.id === activeWidget.id)) return
      
      setSidebarWidgets([...sidebarWidgets, activeWidget])
      setAvailable(available.filter((w) => w.id !== activeWidget.id))
      setFooterWidgets(footerWidgets.filter((w) => w.id !== activeWidget.id))
    }
    // Handle drops to footer
    else if (over.id === 'footer-drop') {
      if (footerWidgets.find((w) => w.id === activeWidget.id)) return
      
      setFooterWidgets([...footerWidgets, activeWidget])
      setAvailable(available.filter((w) => w.id !== activeWidget.id))
      setSidebarWidgets(sidebarWidgets.filter((w) => w.id !== activeWidget.id))
    }
    // Handle reordering within sidebar
    else if (sidebarWidgets.find((w) => w.id === over.id)) {
      const oldIndex = sidebarWidgets.findIndex((w) => w.id === active.id)
      const newIndex = sidebarWidgets.findIndex((w) => w.id === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setSidebarWidgets(arrayMove(sidebarWidgets, oldIndex, newIndex))
      }
    }
    // Handle reordering within footer
    else if (footerWidgets.find((w) => w.id === over.id)) {
      const oldIndex = footerWidgets.findIndex((w) => w.id === active.id)
      const newIndex = footerWidgets.findIndex((w) => w.id === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setFooterWidgets(arrayMove(footerWidgets, oldIndex, newIndex))
      }
    }
  }

  const removeFromSidebar = (widgetId: string) => {
    const widget = sidebarWidgets.find((w) => w.id === widgetId)
    if (widget) {
      setSidebarWidgets(sidebarWidgets.filter((w) => w.id !== widgetId))
      setAvailable([...available, widget])
    }
  }

  const removeFromFooter = (widgetId: string) => {
    const widget = footerWidgets.find((w) => w.id === widgetId)
    if (widget) {
      setFooterWidgets(footerWidgets.filter((w) => w.id !== widgetId))
      setAvailable([...available, widget])
    }
  }

  const activeWidget = available.find((w) => w.id === activeId) ||
                       sidebarWidgets.find((w) => w.id === activeId) ||
                       footerWidgets.find((w) => w.id === activeId)

  return (
    <AdminSidebar>
      <Header title="Widgets" />
      <div className="content-wrapper">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg">Available Widgets</h3>
                  <SortableContext items={available.map((w) => w.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2 mt-4">
                      {available.map((widget) => (
                        <DraggableWidget key={widget.id} widget={widget} />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg">Sidebar</h3>
                  <p className="text-sm text-base-content/70">Drag widgets here</p>
                  <SortableContext items={sidebarWidgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>
                    <DroppableArea id="sidebar-drop">
                      {sidebarWidgets.length === 0 ? (
                        <div className="text-center text-base-content/50 py-8">
                          Drop widgets here
                        </div>
                      ) : (
                        sidebarWidgets.map((widget) => (
                          <SortableWidget
                            key={widget.id}
                            widget={widget}
                            onRemove={() => removeFromSidebar(widget.id)}
                          />
                        ))
                      )}
                    </DroppableArea>
                  </SortableContext>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg">Footer</h3>
                  <p className="text-sm text-base-content/70">Drag widgets here</p>
                  <SortableContext items={footerWidgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>
                    <DroppableArea id="footer-drop">
                      {footerWidgets.length === 0 ? (
                        <div className="text-center text-base-content/50 py-8">
                          Drop widgets here
                        </div>
                      ) : (
                        footerWidgets.map((widget) => (
                          <SortableWidget
                            key={widget.id}
                            widget={widget}
                            onRemove={() => removeFromFooter(widget.id)}
                          />
                        ))
                      )}
                    </DroppableArea>
                  </SortableContext>
                </div>
              </div>
            </div>
          </div>

          <DragOverlay>
            {activeWidget ? (
              <div className="p-3 bg-base-200 rounded-lg shadow-xl">
                {activeWidget.name}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </AdminSidebar>
  )
}
