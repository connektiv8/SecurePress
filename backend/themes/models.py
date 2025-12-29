"""
Theme models for visual editing and customization.
"""

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Theme(models.Model):
    """
    Installed theme with configuration and metadata.
    """
    
    STATUS_CHOICES = [
        ('active', _('Active')),
        ('inactive', _('Inactive')),
    ]
    
    SOURCE_CHOICES = [
        ('wordpress', _('WordPress')),
        ('shopify', _('Shopify')),
        ('custom', _('Custom')),
        ('marketplace', _('Marketplace')),
    ]
    
    # Basic info
    name = models.CharField(_('name'), max_length=200, unique=True)
    slug = models.SlugField(_('slug'), max_length=200, unique=True)
    description = models.TextField(_('description'), blank=True)
    version = models.CharField(_('version'), max_length=50)
    author = models.CharField(_('author'), max_length=200)
    
    # Theme files
    directory = models.CharField(_('directory'), max_length=255, unique=True)
    screenshot = models.ImageField(_('screenshot'), upload_to='themes/screenshots/', null=True, blank=True)
    
    # Metadata
    source = models.CharField(_('source'), max_length=20, choices=SOURCE_CHOICES, default='custom')
    original_theme = models.CharField(_('original theme'), max_length=200, blank=True)
    license = models.CharField(_('license'), max_length=100, default='MIT')
    tags = models.JSONField(_('tags'), default=list, blank=True)
    
    # Features
    supports_blocks = models.BooleanField(_('supports blocks'), default=True)
    supports_widgets = models.BooleanField(_('supports widgets'), default=True)
    supports_visual_editor = models.BooleanField(_('supports visual editor'), default=True)
    
    # Configuration
    settings = models.JSONField(_('settings'), default=dict, blank=True)
    block_patterns = models.JSONField(_('block patterns'), default=list, blank=True)
    widget_areas = models.JSONField(_('widget areas'), default=list, blank=True)
    
    # Status
    status = models.CharField(_('status'), max_length=20, choices=STATUS_CHOICES, default='inactive')
    is_default = models.BooleanField(_('is default'), default=False)
    
    # Stats
    install_count = models.PositiveIntegerField(_('install count'), default=0)
    rating = models.DecimalField(_('rating'), max_digits=3, decimal_places=2, default=0)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('theme')
        verbose_name_plural = _('themes')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def activate(self):
        """Activate this theme and deactivate others."""
        Theme.objects.filter(status='active').update(status='inactive')
        self.status = 'active'
        self.save()


class Block(models.Model):
    """
    Reusable content block for visual editor.
    """
    
    CATEGORY_CHOICES = [
        ('layout', _('Layout')),
        ('content', _('Content')),
        ('media', _('Media')),
        ('form', _('Form')),
        ('widget', _('Widget')),
        ('custom', _('Custom')),
    ]
    
    # Basic info
    type = models.CharField(_('type'), max_length=100, unique=True)
    name = models.CharField(_('name'), max_length=200)
    description = models.TextField(_('description'), blank=True)
    category = models.CharField(_('category'), max_length=20, choices=CATEGORY_CHOICES)
    icon = models.CharField(_('icon'), max_length=50, blank=True)
    
    # Block definition
    attributes = models.JSONField(_('attributes'), default=dict)
    template = models.TextField(_('template'))
    styles = models.TextField(_('styles'), blank=True)
    scripts = models.TextField(_('scripts'), blank=True)
    
    # Configuration
    is_core = models.BooleanField(_('is core block'), default=False)
    is_active = models.BooleanField(_('is active'), default=True)
    
    # Relationships
    theme = models.ForeignKey(
        Theme,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='blocks',
        verbose_name=_('theme')
    )
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_blocks'
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('block')
        verbose_name_plural = _('blocks')
        ordering = ['category', 'name']
    
    def __str__(self):
        return self.name


class PageLayout(models.Model):
    """
    Visual editor layout for pages/posts.
    """
    
    # Relationships
    page = models.ForeignKey(
        'core.Page',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='layouts'
    )
    post = models.ForeignKey(
        'core.Post',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='layouts'
    )
    
    # Layout data
    layout = models.JSONField(_('layout'), default=dict)
    blocks_data = models.JSONField(_('blocks data'), default=list)
    
    # Metadata
    is_active = models.BooleanField(_('is active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('page layout')
        verbose_name_plural = _('page layouts')
    
    def __str__(self):
        if self.page:
            return f"Layout for {self.page.title}"
        elif self.post:
            return f"Layout for {self.post.title}"
        return f"Layout {self.id}"


class Menu(models.Model):
    """
    Navigation menu with visual builder support.
    """
    
    name = models.CharField(_('name'), max_length=200)
    slug = models.SlugField(_('slug'), max_length=200, unique=True)
    location = models.CharField(_('location'), max_length=100, blank=True)
    
    # Menu structure
    items = models.JSONField(_('items'), default=list)
    
    # Settings
    settings = models.JSONField(_('settings'), default=dict)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('menu')
        verbose_name_plural = _('menus')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Widget(models.Model):
    """
    Widget instance placed in widget areas.
    """
    
    # Basic info
    type = models.CharField(_('type'), max_length=100)
    title = models.CharField(_('title'), max_length=200, blank=True)
    
    # Placement
    widget_area = models.CharField(_('widget area'), max_length=100)
    position = models.IntegerField(_('position'), default=0)
    
    # Configuration
    settings = models.JSONField(_('settings'), default=dict)
    
    # Status
    is_active = models.BooleanField(_('is active'), default=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('widget')
        verbose_name_plural = _('widgets')
        ordering = ['widget_area', 'position']
    
    def __str__(self):
        return f"{self.type} in {self.widget_area}"
