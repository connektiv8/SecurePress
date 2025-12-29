"""
Django Admin configuration for core models.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import Category, Media, Page, Post, Tag, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model."""
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'bio', 'avatar')}),
        (_('Permissions'), {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Security'), {
            'fields': ('two_factor_enabled', 'failed_login_attempts', 'last_failed_login', 'account_locked_until'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role'),
        }),
    )
    
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'role')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """Admin interface for Post model."""
    
    list_display = ('title', 'author', 'status', 'published_at', 'view_count', 'created_at')
    list_filter = ('status', 'created_at', 'published_at', 'categories', 'tags')
    search_fields = ('title', 'content', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'content', 'excerpt', 'author')
        }),
        (_('Media'), {
            'fields': ('featured_image',)
        }),
        (_('Organization'), {
            'fields': ('categories', 'tags')
        }),
        (_('Publishing'), {
            'fields': ('status', 'published_at', 'allow_comments')
        }),
        (_('SEO'), {
            'fields': ('meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        (_('Stats'), {
            'fields': ('view_count',),
            'classes': ('collapse',)
        }),
    )
    
    filter_horizontal = ('categories', 'tags')


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    """Admin interface for Page model."""
    
    list_display = ('title', 'author', 'status', 'template', 'menu_order', 'show_in_menu', 'created_at')
    list_filter = ('status', 'template', 'show_in_menu', 'created_at')
    search_fields = ('title', 'content', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'created_at'
    ordering = ('menu_order', 'title')
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'content', 'author')
        }),
        (_('Page Settings'), {
            'fields': ('parent', 'template', 'menu_order', 'show_in_menu', 'featured_image')
        }),
        (_('Publishing'), {
            'fields': ('status', 'published_at')
        }),
        (_('SEO'), {
            'fields': ('meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    """Admin interface for Media model."""
    
    list_display = ('title', 'file_type', 'file_size_human', 'uploaded_by', 'created_at')
    list_filter = ('file_type', 'created_at')
    search_fields = ('title', 'alt_text', 'caption')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('file', 'title', 'alt_text', 'caption')
        }),
        (_('Metadata'), {
            'fields': ('file_type', 'mime_type', 'file_size', 'width', 'height', 'uploaded_by'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('file_type', 'mime_type', 'file_size', 'width', 'height')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin interface for Category model."""
    
    list_display = ('name', 'slug', 'parent', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """Admin interface for Tag model."""
    
    list_display = ('name', 'slug', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)
