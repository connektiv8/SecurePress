import AdminSidebar from '@/components/Layout/AdminSidebar'
import Header from '@/components/Layout/Header'
import { useState, useRef, useEffect } from 'react'
import { 
  FiFilter, FiColumns, FiPlus, FiTrash2, FiCopy, FiSave, 
  FiRefreshCw, FiDownload, FiUpload, FiEdit2
} from 'react-icons/fi'

interface Product {
  id: number
  name: string
  sku: string
  thumbnail?: string
  gallery?: string[]
  cost_price?: number
  price: number
  sale_price?: number
  gross_profit_amount?: number
  gross_profit_percent?: number
  stock: number
  status: 'publish' | 'draft' | 'pending'
  category: string
  type: 'simple' | 'variable' | 'grouped' | 'external'
  featured: boolean
  manage_stock: boolean
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  weight?: number
  length?: number
  width?: number
  height?: number
}

interface Column {
  key: keyof Product
  label: string
  type: 'text' | 'number' | 'select' | 'checkbox' | 'price' | 'image'
  editable: boolean
  width?: number
  align?: 'left' | 'center' | 'right'
  options?: { value: string; label: string }[]
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Premium T-Shirt',
      sku: 'TSHIRT-001',
      thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
      ],
      cost_price: 15.00,
      price: 29.99,
      sale_price: 24.99,
      stock: 150,
      status: 'publish',
      category: 'Apparel',
      type: 'simple',
      featured: true,
      manage_stock: true,
      stock_status: 'instock',
      weight: 0.5,
    },
    {
      id: 2,
      name: 'Cotton Hoodie',
      sku: 'HOODIE-001',
      thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=80&h=80&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
      ],
      cost_price: 35.00,
      price: 59.99,
      stock: 75,
      status: 'publish',
      category: 'Apparel',
      type: 'variable',
      featured: false,
      manage_stock: true,
      stock_status: 'instock',
      weight: 1.2,
    },
    {
      id: 3,
      name: 'Classic Jeans',
      sku: 'JEANS-001',
      thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&h=80&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=400&fit=crop',
      ],
      cost_price: 45.00,
      price: 79.99,
      sale_price: 69.99,
      stock: 0,
      status: 'publish',
      category: 'Apparel',
      type: 'simple',
      featured: false,
      manage_stock: true,
      stock_status: 'outofstock',
      weight: 0.8,
    },
  ])

  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
  const [editingCell, setEditingCell] = useState<{ id: number; field: keyof Product } | null>(null)
  const [tempValue, setTempValue] = useState<any>('')
  const [showFilters, setShowFilters] = useState(false)
  const [showColumns, setShowColumns] = useState(false)
  const editInputRef = useRef<HTMLInputElement>(null)

  const [filters, setFilters] = useState({
    search: '',
    searchField: 'name',
    status: '',
    category: '',
    type: '',
    stockStatus: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
  })

  const columns: Column[] = [
    { key: 'id', label: 'ID', type: 'number', editable: false, width: 60, align: 'center' },
    { key: 'sku', label: 'SKU', type: 'text', editable: true, width: 100 },
    { key: 'thumbnail', label: 'Image', type: 'image', editable: false, width: 50, align: 'center' },
    { key: 'name', label: 'Product Name', type: 'text', editable: true, width: 180 },
    { 
      key: 'type', 
      label: 'Type', 
      type: 'select', 
      editable: true, 
      width: 90,
      align: 'center',
      options: [
        { value: 'simple', label: 'Simple' },
        { value: 'variable', label: 'Variable' },
        { value: 'grouped', label: 'Grouped' },
        { value: 'external', label: 'External' },
      ]
    },
    { key: 'cost_price', label: 'Cost', type: 'price', editable: true, width: 75, align: 'right' },
    { key: 'price', label: 'Price', type: 'price', editable: true, width: 75, align: 'right' },
    { key: 'gross_profit_amount', label: 'GP ($)', type: 'price', editable: false, width: 75, align: 'right' },
    { key: 'gross_profit_percent', label: 'GP (%)', type: 'number', editable: false, width: 75, align: 'right' },
    { key: 'sale_price', label: 'Sale', type: 'price', editable: true, width: 75, align: 'right' },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'select', 
      editable: true, 
      width: 100,
      align: 'center',
      options: [
        { value: 'publish', label: 'Published' },
        { value: 'draft', label: 'Draft' },
        { value: 'pending', label: 'Pending' },
      ]
    },
    { key: 'category', label: 'Category', type: 'text', editable: true, width: 100 },
    { key: 'stock', label: 'Stock', type: 'number', editable: true, width: 70, align: 'center' },
    { 
      key: 'stock_status', 
      label: 'Stock Status', 
      type: 'select', 
      editable: true, 
      width: 100,
      align: 'center',
      options: [
        { value: 'instock', label: 'In Stock' },
        { value: 'outofstock', label: 'Out of Stock' },
        { value: 'onbackorder', label: 'On Backorder' },
      ]
    },
    { key: 'featured', label: 'Featured', type: 'checkbox', editable: true, width: 80, align: 'center' },
    { key: 'weight', label: 'Weight', type: 'number', editable: true, width: 75, align: 'right' },
  ]

  const [visibleColumns, setVisibleColumns] = useState<Set<keyof Product>>(
    new Set(columns.map(col => col.key))
  )
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null)
  const [lightboxPosition, setLightboxPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number>(0)

  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingCell])

  const handleCellClick = (productId: number, field: keyof Product, column: Column) => {
    if (!column.editable) return
    
    const product = products.find(p => p.id === productId)
    if (!product) return

    setEditingCell({ id: productId, field })
    setTempValue(product[field] ?? '')
  }

  const handleCellSave = () => {
    if (!editingCell) return

    const product = products.find(p => p.id === editingCell.id)
    if (!product) return

    const column = columns.find(c => c.key === editingCell.field)
    if (!column) return

    // Parse value based on column type
    let parsedValue: any = tempValue
    if (column.type === 'number' || column.type === 'price') {
      const numValue = parseFloat(tempValue as string)
      parsedValue = isNaN(numValue) ? 0 : numValue
    }

    setProducts(prev => prev.map(p => {
      if (p.id !== editingCell.id) return p
      
      const updatedProduct = { ...p, [editingCell.field]: parsedValue }
      
      // Recalculate gross profit when cost_price or price changes
      if (editingCell.field === 'cost_price' || editingCell.field === 'price') {
        const costPrice = editingCell.field === 'cost_price' ? parsedValue : p.cost_price || 0
        const regularPrice = editingCell.field === 'price' ? parsedValue : p.price || 0
        
        updatedProduct.gross_profit_amount = regularPrice - costPrice
        updatedProduct.gross_profit_percent = costPrice > 0 
          ? ((regularPrice - costPrice) / costPrice) * 100 
          : 0
      }
      
      return updatedProduct
    }))

    setEditingCell(null)
    setTempValue('')
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setTempValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellSave()
    } else if (e.key === 'Escape') {
      handleCellCancel()
    }
  }

  const toggleSelection = (id: number) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const selectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)))
    }
  }

  const deleteSelected = () => {
    if (confirm(`Delete ${selectedProducts.size} product(s)?`)) {
      setProducts(prev => prev.filter(p => !selectedProducts.has(p.id)))
      setSelectedProducts(new Set())
    }
  }

  const duplicateSelected = () => {
    const toDuplicate = products.filter(p => selectedProducts.has(p.id))
    const newProducts = toDuplicate.map(p => ({
      ...p,
      id: Math.max(...products.map(pr => pr.id)) + 1 + Math.random(),
      name: `${p.name} (Copy)`,
      sku: `${p.sku}-COPY`,
    }))
    setProducts(prev => [...prev, ...newProducts])
    setSelectedProducts(new Set())
  }

  const renderCell = (product: Product, column: Column) => {
    const value = product[column.key]
    const isEditing = editingCell?.id === product.id && editingCell?.field === column.key

    if (isEditing) {
      if (column.type === 'checkbox') {
        return (
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={tempValue as boolean}
            onChange={(e) => setTempValue(e.target.checked)}
            onBlur={handleCellSave}
            autoFocus
          />
        )
      }

      if (column.type === 'select') {
        return (
          <select
            ref={editInputRef as any}
            className="w-full border-0 p-0 m-0 h-full focus:outline-none"
            style={{ 
              backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))', 
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              minHeight: '1.5rem'
            }}
            value={tempValue as string}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleCellSave}
            onKeyDown={handleKeyDown}
          >
            {column.options?.map(opt => (
              <option 
                key={opt.value} 
                value={opt.value}
              >
                {opt.label}
              </option>
            ))}
          </select>
        )
      }

      // Text, number, and price inputs - Excel-like editing
      return (
        <input
          ref={editInputRef}
          type="text"
          className="w-full bg-transparent border-0 outline-none focus:outline-none p-0 m-0"
          style={{ height: '100%' }}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleCellSave}
          onKeyDown={handleKeyDown}
        />
      )
    }

    // Display mode
    if (column.type === 'image') {
      const isHovered = hoveredProductId === product.id
      const gallery = product.gallery || []
      const mainImage = gallery.length > 0 ? gallery[selectedGalleryIndex] : (value as string)
      
      const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setLightboxPosition({ 
          x: rect.right, 
          y: rect.top + (rect.height / 2)
        })
        setHoveredProductId(product.id)
        setSelectedGalleryIndex(0)
      }

      const handleMouseLeave = () => {
        setHoveredProductId(null)
        setLightboxPosition(null)
        setSelectedGalleryIndex(0)
      }
      
      return (
        <div 
          className="flex items-center justify-center"
          onMouseLeave={handleMouseLeave}
        >
          {value ? (
            <div 
              className="relative inline-block"
              onMouseEnter={handleMouseEnter}
            >
              <img 
                src={value as string} 
                alt="Product" 
                className="w-10 h-10 object-cover rounded cursor-pointer"
              />
              
              {isHovered && lightboxPosition && (
                <div 
                  className="fixed bg-base-100 border-2 border-base-300 rounded-lg shadow-2xl p-3 z-[9999]"
                  style={{ 
                    left: `${lightboxPosition.x}px`,
                    top: `${lightboxPosition.y}px`,
                    transform: 'translateY(-50%)'
                  }}
                >
                  {/* Main image */}
                  <img 
                    src={mainImage} 
                    alt="Product preview" 
                    className="w-[400px] h-[400px] object-cover rounded-lg mb-2"
                  />
                  
                  {/* Thumbnail strip */}
                  {gallery.length > 0 && (
                    <div className="flex gap-2 justify-center">
                      {gallery.map((img, idx) => (
                        <img 
                          key={idx}
                          src={img} 
                          alt={`Thumbnail ${idx + 1}`}
                          className={`w-10 h-10 object-cover rounded cursor-pointer hover:ring-2 hover:ring-primary ${
                            idx === selectedGalleryIndex ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedGalleryIndex(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="w-10 h-10 bg-base-300 rounded flex items-center justify-center text-xs">
              No Image
            </div>
          )}
        </div>
      )
    }

    if (column.type === 'checkbox') {
      return (
        <input
          type="checkbox"
          className="checkbox checkbox-sm checkbox-primary"
          checked={value as boolean}
          onChange={() => handleCellClick(product.id, column.key, column)}
        />
      )
    }

    if (column.type === 'price') {
      // Calculate gross profit on the fly if not already set
      if (column.key === 'gross_profit_amount') {
        const amount = (product.price || 0) - (product.cost_price || 0)
        return <span className="font-mono tabular-nums">${amount.toFixed(2)}</span>
      }
      return <span className="font-mono tabular-nums">${(value as number)?.toFixed(2) ?? '0.00'}</span>
    }

    if (column.type === 'number' && column.key === 'gross_profit_percent') {
      const costPrice = product.cost_price || 0
      const regularPrice = product.price || 0
      const percent = costPrice > 0 ? ((regularPrice - costPrice) / costPrice) * 100 : 0
      return <span className="font-mono tabular-nums">{percent.toFixed(2)}%</span>
    }

    if (column.type === 'number' && column.key === 'weight') {
      return <span className="font-mono tabular-nums">{(value as number)?.toFixed(2) ?? '0.00'}</span>
    }

    if (column.type === 'select') {
      const option = column.options?.find(opt => opt.value === value)
      return (
        <span className={`badge badge-sm ${
          column.key === 'status' 
            ? value === 'publish' ? 'badge-success' : value === 'draft' ? 'badge-warning' : 'badge-info'
            : column.key === 'stock_status'
            ? value === 'instock' ? 'badge-success' : value === 'outofstock' ? 'badge-error' : 'badge-warning'
            : 'badge-ghost'
        }`}>
          {option?.label ?? value}
        </span>
      )
    }

    return <span>{value?.toString() ?? '-'}</span>
  }

  const applyFilters = () => {
    // TODO: Apply filters to products
    console.log('Applying filters:', filters)
    setShowFilters(false)
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      searchField: 'name',
      status: '',
      category: '',
      type: '',
      stockStatus: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      maxStock: '',
    })
  }

  return (
    <AdminSidebar>
      <Header title="Products" />
      <div className="px-4 py-8">
        {/* Top Toolbar */}
        <div className="card bg-base-100 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="flex flex-wrap gap-2">
              {/* Action Buttons */}
              <div className="flex gap-2 items-center">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FiFilter /> Filters
                </button>
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => setShowColumns(!showColumns)}
                >
                  <FiColumns /> Columns
                </button>
              </div>

              <div className="divider divider-horizontal my-0"></div>

              {/* Bulk Actions */}
              <div className="flex gap-2 items-center">
                <button className="btn btn-sm btn-success">
                  <FiPlus /> New Product
                </button>
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={duplicateSelected}
                  disabled={selectedProducts.size === 0}
                >
                  <FiCopy /> Duplicate ({selectedProducts.size})
                </button>
                <button 
                  className="btn btn-sm btn-error btn-outline"
                  onClick={deleteSelected}
                  disabled={selectedProducts.size === 0}
                >
                  <FiTrash2 /> Delete ({selectedProducts.size})
                </button>
              </div>

              <div className="divider divider-horizontal my-0"></div>

              {/* Quick Search */}
              <div className="flex gap-2 items-center flex-1">
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="input input-sm input-bordered flex-1 max-w-xs"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
                <select 
                  className="select select-sm select-bordered"
                  value={filters.searchField}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchField: e.target.value }))}
                >
                  <option value="name">Name</option>
                  <option value="sku">SKU</option>
                  <option value="id">ID</option>
                </select>
              </div>

              <div className="divider divider-horizontal my-0"></div>

              {/* Utility Buttons */}
              <div className="flex gap-2 items-center">
                <button className="btn btn-sm btn-ghost">
                  <FiDownload /> Export
                </button>
                <button className="btn btn-sm btn-ghost">
                  <FiUpload /> Import
                </button>
                <button className="btn btn-sm btn-primary">
                  <FiSave /> Save All
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-base-200 rounded-lg">
                <h3 className="font-semibold mb-3">Advanced Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="form-control">
                    <label className="label label-text">Status</label>
                    <select 
                      className="select select-sm select-bordered"
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="">All</option>
                      <option value="publish">Published</option>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label label-text">Type</label>
                    <select 
                      className="select select-sm select-bordered"
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="">All</option>
                      <option value="simple">Simple</option>
                      <option value="variable">Variable</option>
                      <option value="grouped">Grouped</option>
                      <option value="external">External</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label label-text">Stock Status</label>
                    <select 
                      className="select select-sm select-bordered"
                      value={filters.stockStatus}
                      onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
                    >
                      <option value="">All</option>
                      <option value="instock">In Stock</option>
                      <option value="outofstock">Out of Stock</option>
                      <option value="onbackorder">On Backorder</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label label-text">Category</label>
                    <input
                      type="text"
                      className="input input-sm input-bordered"
                      placeholder="Category..."
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label label-text">Min Price</label>
                    <input
                      type="number"
                      className="input input-sm input-bordered"
                      placeholder="0.00"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label label-text">Max Price</label>
                    <input
                      type="number"
                      className="input input-sm input-bordered"
                      placeholder="9999.99"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label label-text">Min Stock</label>
                    <input
                      type="number"
                      className="input input-sm input-bordered"
                      placeholder="0"
                      value={filters.minStock}
                      onChange={(e) => setFilters(prev => ({ ...prev, minStock: e.target.value }))}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label label-text">Max Stock</label>
                    <input
                      type="number"
                      className="input input-sm input-bordered"
                      placeholder="9999"
                      value={filters.maxStock}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxStock: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="btn btn-sm btn-primary" onClick={applyFilters}>
                    Apply Filters
                  </button>
                  <button className="btn btn-sm btn-ghost" onClick={resetFilters}>
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Column Manager */}
            {showColumns && (
              <div className="mt-4 p-4 bg-base-200 rounded-lg">
                <h3 className="font-semibold mb-3">Manage Columns</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {columns.map(col => (
                    <label key={col.key} className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={visibleColumns.has(col.key)}
                        onChange={(e) => {
                          setVisibleColumns(prev => {
                            const newSet = new Set(prev)
                            if (e.target.checked) {
                              newSet.add(col.key)
                            } else {
                              newSet.delete(col.key)
                            }
                            return newSet
                          })
                        }}
                      />
                      <span className="label-text text-xs">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spreadsheet Table */}
        <div className="card bg-base-100 shadow-sm">
          <div className="overflow-x-auto p-4">
            <table className="table table-xs table-pin-rows table-pin-cols">
              <thead>
                <tr>
                  <th className="bg-base-200">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedProducts.size === products.length && products.length > 0}
                      onChange={selectAll}
                    />
                  </th>
                  {columns.filter(col => visibleColumns.has(col.key)).map(col => (
                    <th 
                      key={col.key} 
                      className="bg-base-200" 
                      style={{ 
                        minWidth: col.width,
                        textAlign: col.align || 'left'
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr 
                    key={product.id}
                    className={selectedProducts.has(product.id) ? 'bg-primary/10' : ''}
                  >
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => toggleSelection(product.id)}
                      />
                    </td>
                    {columns.filter(col => visibleColumns.has(col.key)).map(col => (
                      <td 
                        key={col.key}
                        className={`cursor-pointer hover:bg-base-200 ${
                          col.type === 'price' ? 'tabular-nums' : ''
                        }`}
                        style={{ textAlign: col.align || 'left' }}
                        onClick={() => handleCellClick(product.id, col.key, col)}
                      >
                        {renderCell(product, col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="flex justify-between items-center mt-4 text-sm text-base-content/70">
          <div>
            Showing {products.length} product(s) | {selectedProducts.size} selected
          </div>
          <div className="flex gap-2">
            <select className="select select-sm select-bordered">
              <option>25 per page</option>
              <option>50 per page</option>
              <option>100 per page</option>
            </select>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
