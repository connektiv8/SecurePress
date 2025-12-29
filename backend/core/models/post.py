"""
Post model for SecurePress.

Represents blog posts with rich content, SEO fields, and publishing workflow.
"""

from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class Post(models.Model):
    """
    Blog post model with full CMS features.
    
    Includes content management, SEO optimization, categorization,
    and a complete publishing workflow.
    """
    
    STATUS_CHOICES = [
        ('draft', _('Draft')),
        ('published', _('Published')),
        ('scheduled', _('Scheduled')),
        ('archived', _('Archived')),
    ]
    
    # Basic fields
    title = models.CharField(
        _('title'),
        max_length=200,
        help_text=_('Post title (max 200 characters).')
    )
    
    slug = models.SlugField(
        _('slug'),
        max_length=200,
        unique=True,
        help_text=_('URL-friendly version of the title.')
    )
    
    content = models.TextField(
        _('content'),
        help_text=_('Post content (supports rich text/HTML).')
    )
    
    excerpt = models.TextField(
        _('excerpt'),
        blank=True,
        help_text=_('Short excerpt or summary of the post.')
    )
    
    # Relationships
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='posts',
        verbose_name=_('author'),
        help_text=_('Author of the post.')
    )
    
    featured_image = models.ForeignKey(
        'Media',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='featured_posts',
        verbose_name=_('featured image'),
        help_text=_('Main image for the post.')
    )
    
    # Categories and tags
    categories = models.ManyToManyField(
        'Category',
        blank=True,
        related_name='posts',
        verbose_name=_('categories'),
        help_text=_('Categories this post belongs to.')
    )
    
    tags = models.ManyToManyField(
        'Tag',
        blank=True,
        related_name='posts',
        verbose_name=_('tags'),
        help_text=_('Tags for this post.')
    )
    
    # Publishing
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        help_text=_('Publication status of the post.')
    )
    
    published_at = models.DateTimeField(
        _('published at'),
        null=True,
        blank=True,
        help_text=_('Date and time when the post was/will be published.')
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
    
    # Engagement
    view_count = models.PositiveIntegerField(
        _('view count'),
        default=0,
        help_text=_('Number of times this post has been viewed.')
    )
    
    allow_comments = models.BooleanField(
        _('allow comments'),
        default=True,
        help_text=_('Whether comments are allowed on this post.')
    )
    
    # Metadata
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('post')
        verbose_name_plural = _('posts')
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'published_at']),
            models.Index(fields=['author', 'status']),
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
        """Check if the post is published."""
        return self.status == 'published'
    
    def can_be_edited_by(self, user):
        """Check if a user can edit this post."""
        if user.is_superuser or user.is_editor:
            return True
        return self.author == user and user.is_author


class Category(models.Model):
    """Category model for organizing posts."""
    
    name = models.CharField(
        _('name'),
        max_length=100,
        unique=True,
        help_text=_('Category name.')
    )
    
    slug = models.SlugField(
        _('slug'),
        max_length=100,
        unique=True,
        help_text=_('URL-friendly category name.')
    )
    
    description = models.TextField(
        _('description'),
        blank=True,
        help_text=_('Category description.')
    )
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_('parent category'),
        help_text=_('Parent category for hierarchical organization.')
    )
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        """Auto-generate slug if not provided."""
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(models.Model):
    """Tag model for organizing posts."""
    
    name = models.CharField(
        _('name'),
        max_length=50,
        unique=True,
        help_text=_('Tag name.')
    )
    
    slug = models.SlugField(
        _('slug'),
        max_length=50,
        unique=True,
        help_text=_('URL-friendly tag name.')
    )
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('tag')
        verbose_name_plural = _('tags')
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        """Auto-generate slug if not provided."""
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
