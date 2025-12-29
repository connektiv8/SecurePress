"""
Page model for SecurePress.

Represents static pages with hierarchical structure and template support.
"""

from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class Page(models.Model):
    """
    Static page model for CMS.
    
    Pages are simpler than posts and used for static content like
    "About Us", "Contact", etc. Supports hierarchical structure.
    """
    
    STATUS_CHOICES = [
        ('draft', _('Draft')),
        ('published', _('Published')),
        ('archived', _('Archived')),
    ]
    
    TEMPLATE_CHOICES = [
        ('default', _('Default Template')),
        ('fullwidth', _('Full Width')),
        ('landing', _('Landing Page')),
        ('contact', _('Contact Page')),
    ]
    
    # Basic fields
    title = models.CharField(
        _('title'),
        max_length=200,
        help_text=_('Page title (max 200 characters).')
    )
    
    slug = models.SlugField(
        _('slug'),
        max_length=200,
        unique=True,
        help_text=_('URL-friendly version of the title.')
    )
    
    content = models.TextField(
        _('content'),
        help_text=_('Page content (supports rich text/HTML).')
    )
    
    # Relationships
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='pages',
        verbose_name=_('author'),
        help_text=_('Author of the page.')
    )
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_('parent page'),
        help_text=_('Parent page for hierarchical structure.')
    )
    
    featured_image = models.ForeignKey(
        'Media',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='featured_pages',
        verbose_name=_('featured image'),
        help_text=_('Main image for the page.')
    )
    
    # Page settings
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        help_text=_('Publication status of the page.')
    )
    
    template = models.CharField(
        _('template'),
        max_length=50,
        choices=TEMPLATE_CHOICES,
        default='default',
        help_text=_('Template to use for rendering this page.')
    )
    
    menu_order = models.IntegerField(
        _('menu order'),
        default=0,
        help_text=_('Order in navigation menus (lower numbers appear first).')
    )
    
    show_in_menu = models.BooleanField(
        _('show in menu'),
        default=True,
        help_text=_('Whether to show this page in navigation menus.')
    )
    
    # SEO fields
    meta_description = models.CharField(
        _('meta description'),
        max_length=160,
        blank=True,
        help_text=_('SEO meta description (max 160 characters).')
    )
    
    meta_keywords = models.CharField(
        _('meta keywords'),
        max_length=255,
        blank=True,
        help_text=_('SEO keywords (comma-separated).')
    )
    
    # Metadata
    published_at = models.DateTimeField(
        _('published at'),
        null=True,
        blank=True,
        help_text=_('Date and time when the page was published.')
    )
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('page')
        verbose_name_plural = _('pages')
        ordering = ['menu_order', 'title']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'published_at']),
            models.Index(fields=['menu_order']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        """Auto-generate slug if not provided."""
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @property
    def is_published(self):
        """Check if the page is published."""
        return self.status == 'published'
    
    def get_breadcrumb(self):
        """Get the breadcrumb trail for this page."""
        breadcrumb = [self]
        parent = self.parent
        while parent:
            breadcrumb.insert(0, parent)
            parent = parent.parent
        return breadcrumb
    
    def can_be_edited_by(self, user):
        """Check if a user can edit this page."""
        if user.is_superuser or user.is_editor:
            return True
        return self.author == user and user.is_author
