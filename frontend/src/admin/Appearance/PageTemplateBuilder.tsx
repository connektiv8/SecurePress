import { useState } from 'react'
import AdminSidebar from '@/components/Layout/AdminSidebar'
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
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FiType, FiImage, FiMenu as FiMenuIcon, FiLayout, FiDatabase, FiSave, FiX, FiGrid, FiStar, FiMessageSquare, FiMail, FiCommand } from 'react-icons/fi'

type WidgetType = 'header' | 'textbox' | 'image' | 'menu' | 'footer' | 'hero' | 'content-block' | 'gallery' | 'features' | 'cta' | 'testimonials' | 'contact-form'

interface Widget {
  id: string
  type: WidgetType
  name: string
  icon: any
}

interface PlacedWidget extends Widget {
  row: number
  col: number
  width: number
  height: number
  config?: {
    datasource?: 'manual' | 'page-content'
    content?: string
  }
}

const availableWidgets: Widget[] = [
  { id: 'header', type: 'header', name: 'Header', icon: FiLayout },
  { id: 'hero', type: 'hero', name: 'Hero Section', icon: FiCommand },
  { id: 'textbox', type: 'textbox', name: 'Textbox', icon: FiType },
  { id: 'content-block', type: 'content-block', name: 'Content Block', icon: FiDatabase },
  { id: 'image', type: 'image', name: 'Image', icon: FiImage },
  { id: 'gallery', type: 'gallery', name: 'Image Gallery', icon: FiGrid },
  { id: 'features', type: 'features', name: 'Features Grid', icon: FiGrid },
  { id: 'cta', type: 'cta', name: 'Call-to-Action', icon: FiStar },
  { id: 'testimonials', type: 'testimonials', name: 'Testimonials', icon: FiMessageSquare },
  { id: 'contact-form', type: 'contact-form', name: 'Contact Form', icon: FiMail },
  { id: 'menu', type: 'menu', name: 'Menu', icon: FiMenuIcon },
  { id: 'footer', type: 'footer', name: 'Footer', icon: FiLayout },
]

function AvailableWidget({ widget }: { widget: Widget }) {
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
      className="p-4 bg-base-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-base-300 transition-colors flex items-center gap-3"
    >
      <widget.icon className="w-5 h-5" />
      <span className="font-medium">{widget.name}</span>
    </div>
  )
}

function GridWidget({ widget, onRemove, onResize, onMove }: { 
  widget: PlacedWidget
  onRemove: () => void
  onResize: (width: number, height: number) => void
  onMove: (col: number, row: number) => void
}) {
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDownMove = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    
    const startX = e.clientX
    const startY = e.clientY
    const startCol = widget.col
    const startRow = widget.row

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = Math.round((e.clientX - startX) / 100)
      const deltaY = Math.round((e.clientY - startY) / 60)
      
      const newCol = Math.max(0, Math.min(12 - widget.width, startCol + deltaX))
      const newRow = Math.max(0, Math.min(8 - widget.height, startRow + deltaY))
      
      onMove(newCol, newRow)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseDownResize = (e: React.MouseEvent, direction: string) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = widget.width
    const startHeight = widget.height
    const startCol = widget.col
    const startRow = widget.row

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = Math.round((e.clientX - startX) / 100)
      const deltaY = Math.round((e.clientY - startY) / 60)
      
      let newWidth = startWidth
      let newHeight = startHeight
      let newCol = startCol
      let newRow = startRow

      // Handle different resize directions
      if (direction.includes('e')) {
        newWidth = Math.max(1, Math.min(12 - startCol, startWidth + deltaX))
      }
      if (direction.includes('w')) {
        const change = Math.min(startCol, Math.max(-startWidth + 1, deltaX))
        newWidth = startWidth - change
        newCol = startCol + change
      }
      if (direction.includes('s')) {
        newHeight = Math.max(1, Math.min(8 - startRow, startHeight + deltaY))
      }
      if (direction.includes('n')) {
        const change = Math.min(startRow, Math.max(-startHeight + 1, deltaY))
        newHeight = startHeight - change
        newRow = startRow + change
      }
      
      onResize(newWidth, newHeight)
      if (newCol !== startCol || newRow !== startRow) {
        onMove(newCol, newRow)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const Icon = widget.icon

  return (
    <div
      style={{
        gridColumn: `${widget.col + 1} / span ${widget.width}`,
        gridRow: `${widget.row + 1} / span ${widget.height}`,
      }}
      className={`relative bg-primary/10 border-2 border-primary rounded-lg group ${
        isResizing || isDragging ? 'z-50' : ''
      }`}
    >
      {/* Draggable header */}
      <div
        onMouseDown={handleMouseDownMove}
        className="cursor-move p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">{widget.name}</span>
        </div>
        <button
          onClick={onRemove}
          className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
      
      <div className="px-4 pb-4 text-xs text-base-content/50">
        {widget.width} × {widget.height}
      </div>

      {/* 8 Resize handles */}
      {/* Top-left */}
      <div
        onMouseDown={(e) => handleMouseDownResize(e, 'nw')}
        className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity border-2 border-base-100"
      />
      {/* Top */}
      <div
        onMouseDown={(e) => handleMouseDownResize(e, 'n')}
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full cursor-n-resize opacity-0 group-hover:opacity-100 transition-opacity border-2 border-base-100"
      />
      {/* Top-right */}
      <div
        onMouseDown={(e) => handleMouseDownResize(e, 'ne')}
        className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity border-2 border-base-100"
      />
      {/* Right */}
      <div
        onMouseDown={(e) => handleMouseDownResize(e, 'e')}
        className="absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-3 bg-primary rounded-full cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity border-2 border-base-100"
      />
      {/* Bottom-right */}
      <div
        onMouseDown={(e) => handleMouseDownResize(e, 'se')}
        className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity border-2 border-base-100"
      />
      {/* Bottom */}
      <div
        onMouseDown={(e) => handleMouseDownResize(e, 's')}
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity border-2 border-base-100"
      />
      {/* Bottom-left */}
      <div
        onMouseDown={(e) => handleMouseDownResize(e, 'sw')}
        className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity border-2 border-base-100"
      />
      {/* Left */}
      <div
        onMouseDown={(e) => handleMouseDownResize(e, 'w')}
        className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-3 bg-primary rounded-full cursor-w-resize opacity-0 group-hover:opacity-100 transition-opacity border-2 border-base-100"
      />
    </div>
  )
}

function GridCanvas({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop' })
  
  return (
    <div
      ref={setNodeRef}
      className={`relative grid grid-cols-12 grid-rows-8 gap-2 p-6 bg-base-200 rounded-lg min-h-[600px] border-2 border-dashed transition-colors ${
        isOver ? 'border-primary bg-primary/5' : 'border-base-300'
      }`}
      style={{
        gridAutoRows: '60px',
        backgroundImage: `radial-gradient(circle, oklch(var(--bc) / 0.2) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        backgroundPosition: 'center center'
      }}
    >
      {children}
    </div>
  )
}

export default function PageTemplateBuilder() {
  const [templateName, setTemplateName] = useState('Untitled Template')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [placedWidgets, setPlacedWidgets] = useState<PlacedWidget[]>([])
  const [widgetCounter, setWidgetCounter] = useState(0)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || over.id !== 'canvas-drop') return

    const sourceWidget = availableWidgets.find((w) => w.id === active.id)
    if (!sourceWidget) return

    // Add widget to canvas at default position
    const newWidget: PlacedWidget = {
      ...sourceWidget,
      id: `${sourceWidget.type}-${widgetCounter}`,
      row: Math.floor(placedWidgets.length / 3),
      col: (placedWidgets.length % 3) * 4,
      width: 4,
      height: 2,
    }

    setPlacedWidgets([...placedWidgets, newWidget])
    setWidgetCounter(widgetCounter + 1)
  }

  const removeWidget = (widgetId: string) => {
    setPlacedWidgets(placedWidgets.filter((w) => w.id !== widgetId))
  }

  const resizeWidget = (widgetId: string, width: number, height: number) => {
    setPlacedWidgets(
      placedWidgets.map((w) =>
        w.id === widgetId ? { ...w, width, height } : w
      )
    )
  }

  const moveWidget = (widgetId: string, col: number, row: number) => {
    setPlacedWidgets(
      placedWidgets.map((w) =>
        w.id === widgetId ? { ...w, col, row } : w
      )
    )
  }

  const handleSave = () => {
    const templateData = {
      name: templateName,
      widgets: placedWidgets,
    }
    console.log('Saving template:', templateData)
    // TODO: Save to backend
    alert('Template saved! (Backend integration pending)')
  }

  const activeWidget = availableWidgets.find((w) => w.id === activeId)

  return (
    <AdminSidebar>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 bg-base-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2"
              placeholder="Template Name"
            />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost gap-2">
              <FiX /> Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary gap-2">
              <FiSave /> Save Template
            </button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 flex overflow-hidden">
            {/* Main Canvas */}
            <div className="flex-1 overflow-auto p-6 bg-base-200">
              <div className="max-w-7xl mx-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Canvas (12 × 8 Grid)</h3>
                  <p className="text-sm text-base-content/70">Drag widgets from the right panel and resize them on the grid</p>
                </div>
                
                <GridCanvas>
                  {placedWidgets.map((widget) => (
                    <GridWidget
                      key={widget.id}
                      widget={widget}
                      onRemove={() => removeWidget(widget.id)}
                      onResize={(width, height) => resizeWidget(widget.id, width, height)}
                      onMove={(col, row) => moveWidget(widget.id, col, row)}
                    />
                  ))}
                </GridCanvas>
              </div>
            </div>

            {/* Widget Panel */}
            <div className="w-80 bg-base-100 p-6 space-y-6 overflow-auto">
              <div>
                <h3 className="text-lg font-semibold mb-1">Available Widgets</h3>
                <p className="text-sm text-base-content/70 mb-4">Drag to canvas to add</p>
                
                <div className="space-y-3">
                  {availableWidgets.map((widget) => (
                    <AvailableWidget key={widget.id} widget={widget} />
                  ))}
                </div>
              </div>

              {placedWidgets.length > 0 && (
                <div className="divider">Template Structure</div>
              )}

              {placedWidgets.length > 0 && (
                <div className="space-y-2">
                  {placedWidgets.map((widget) => (
                    <div key={widget.id} className="text-xs bg-base-200 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <widget.icon className="w-3 h-3" />
                        <span className="font-medium">{widget.name}</span>
                      </div>
                      <div className="text-base-content/50 mt-1">
                        Position: ({widget.col}, {widget.row}) • Size: {widget.width}×{widget.height}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DragOverlay>
            {activeWidget ? (
              <div className="p-4 bg-base-200 rounded-lg shadow-xl flex items-center gap-3">
                <activeWidget.icon className="w-5 h-5" />
                <span className="font-medium">{activeWidget.name}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </AdminSidebar>
  )
}
