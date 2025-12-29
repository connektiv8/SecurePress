# SecurePress Themes

> Modern, installable themes with advanced visual editing

## Overview

SecurePress supports a comprehensive theme system with:
- **Hundreds of themes** - Initially imported from WordPress and Shopify
- **Visual Editor** - Grid-based, drag-and-drop block editor
- **Live Preview** - Real-time theme customization
- **Block System** - Reusable content blocks
- **Widget Areas** - Flexible sidebar and footer widgets
- **Menu Builder** - Visual menu editor

## Theme Structure

Each theme follows this structure:

```
theme-name/
├── theme.json           # Theme metadata and configuration
├── screenshot.png       # Theme preview (1200x900)
├── README.md           # Theme documentation
├── templates/          # Page templates
│   ├── index.html     # Homepage template
│   ├── post.html      # Single post template
│   ├── page.html      # Single page template
│   ├── archive.html   # Archive template
│   └── search.html    # Search results template
├── blocks/            # Custom blocks
│   ├── hero.json
│   ├── features.json
│   └── cta.json
├── widgets/           # Widget definitions
│   ├── recent-posts.json
│   └── categories.json
├── styles/            # Theme styles
│   ├── main.css
│   ├── variables.css
│   └── responsive.css
├── scripts/           # Theme scripts
│   └── main.js
└── assets/            # Theme assets
    ├── images/
    └── fonts/
```

## Theme Configuration (`theme.json`)

```json
{
  "name": "Modern Business",
  "version": "1.0.0",
  "author": "SecurePress Team",
  "description": "Clean, modern theme for business websites",
  "screenshot": "screenshot.png",
  "tags": ["business", "modern", "clean", "responsive"],
  "source": "wordpress",
  "original_theme": "Astra",
  "license": "GPL-3.0",
  "supports": {
    "blocks": true,
    "widgets": true,
    "menus": ["primary", "footer"],
    "customizer": true,
    "visual_editor": true
  },
  "settings": {
    "colors": {
      "primary": "#3b82f6",
      "secondary": "#6366f1",
      "accent": "#10b981"
    },
    "typography": {
      "heading_font": "Inter",
      "body_font": "Open Sans"
    },
    "layout": {
      "container_width": "1200px",
      "sidebar_position": "right"
    }
  },
  "block_patterns": [
    "hero-with-image",
    "features-grid",
    "pricing-table",
    "testimonials",
    "call-to-action"
  ],
  "widget_areas": [
    {
      "id": "sidebar",
      "name": "Sidebar",
      "description": "Main sidebar widget area"
    },
    {
      "id": "footer-1",
      "name": "Footer Column 1",
      "description": "First footer column"
    }
  ]
}
```

## Visual Editor Features

### Grid-Based Layout
- Drag-and-drop blocks into grid cells
- Responsive grid system (12-column)
- Auto-arrange and snap-to-grid
- Custom grid layouts per page

### Block Editor
- **Pre-built Blocks**: Hero, Features, Pricing, Testimonials, Gallery, etc.
- **Custom Blocks**: Create your own reusable blocks
- **Block Library**: Browse and insert from library
- **Block Settings**: Configure spacing, colors, typography
- **Nested Blocks**: Blocks within blocks

### Widget System
- Drag widgets into designated areas
- Widget-specific settings
- Custom widget creation
- Widget templates

### Menu Builder
- Visual menu editor
- Drag-and-drop menu items
- Multi-level menus
- Custom menu locations
- Icon support

## Theme Categories

### Imported from WordPress
- Business & Corporate
- Blog & Magazine
- Portfolio & Creative
- E-commerce (WooCommerce compatible)
- Landing Pages
- Photography

### Imported from Shopify
- E-commerce focused
- Product showcases
- Store layouts
- Checkout optimized

## Theme Installation

### Via Admin Panel
1. Go to **Appearance → Themes**
2. Click **Add New**
3. Upload theme ZIP or select from library
4. Click **Install**
5. Click **Activate**

### Via CLI
```bash
# Install theme from directory
make theme-install THEME=theme-name

# Activate theme
make theme-activate THEME=theme-name
```

## Theme Development

### Creating a New Theme

1. **Create theme directory**:
```bash
mkdir -p themes/my-theme
cd themes/my-theme
```

2. **Create theme.json**:
```json
{
  "name": "My Theme",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "My custom theme"
}
```

3. **Create templates**:
```html
<!-- templates/index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{{ site.name }}</title>
  <link rel="stylesheet" href="{% static 'styles/main.css' %}">
</head>
<body>
  <div id="root">
    <!-- Theme content -->
  </div>
</body>
</html>
```

4. **Test theme**:
```bash
make theme-preview THEME=my-theme
```

### Theme Conversion Tools

SecurePress includes converters for popular theme formats:

#### WordPress Theme Converter
```bash
# Convert WordPress theme
python manage.py convert_wordpress_theme \
  --input /path/to/wordpress-theme \
  --output themes/converted-theme
```

#### Shopify Theme Converter
```bash
# Convert Shopify theme
python manage.py convert_shopify_theme \
  --input /path/to/shopify-theme \
  --output themes/converted-theme
```

## Visual Editor API

### JavaScript API

```javascript
// Initialize visual editor
const editor = new SecurePressEditor({
  container: '#editor',
  theme: 'current',
  mode: 'visual'
})

// Add block
editor.addBlock('hero', {
  title: 'Welcome to SecurePress',
  subtitle: 'Modern, Secure CMS',
  image: '/media/hero.jpg'
})

// Save changes
editor.save()
```

### Block Definition

```json
{
  "type": "hero",
  "name": "Hero Section",
  "category": "layout",
  "icon": "hero",
  "attributes": {
    "title": {
      "type": "string",
      "default": ""
    },
    "subtitle": {
      "type": "string",
      "default": ""
    },
    "image": {
      "type": "media",
      "default": null
    },
    "alignment": {
      "type": "select",
      "options": ["left", "center", "right"],
      "default": "center"
    }
  },
  "template": "blocks/hero.html"
}
```

## Best Practices

1. **Keep themes lightweight** - Optimize images and code
2. **Mobile-first design** - Ensure responsive layouts
3. **Accessibility** - Follow WCAG guidelines
4. **Performance** - Minimize HTTP requests
5. **SEO-friendly** - Proper heading structure
6. **Security** - Sanitize all inputs

## Theme Marketplace (Coming Soon)

- Browse premium themes
- One-click installation
- Automatic updates
- Theme ratings and reviews
- Developer marketplace

## Resources

- [Theme Development Guide](./THEME_DEVELOPMENT.md)
- [Block Editor API](./BLOCK_EDITOR_API.md)
- [Theme Examples](../themes/examples/)
- [Conversion Tools](./THEME_CONVERSION.md)

---

**Status**: Theme system architecture in place, visual editor coming in v1.1
