"""
Media model for SecurePress.

Handles file uploads with security features, metadata, and image processing.
"""

import mimetypes
import os
from pathlib import Path

from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from PIL import Image


def media_upload_path(instance, filename):
    """
    Generate secure upload path for media files.
    
    Organizes files by year/month and sanitizes filenames.
    """
    from datetime import datetime
    
    # Sanitize filename
    name = Path(filename).stem
    ext = Path(filename).suffix.lower()
    safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).strip()
    safe_name = safe_name.replace(' ', '_')
    
    # Organize by upload date
    now = datetime.now()
    return f'uploads/{now.year}/{now.month:02d}/{safe_name}{ext}'


class Media(models.Model):
    """
    Media library model for secure file management.
    
    Handles file uploads with validation, metadata extraction,
    and secure serving. Supports images with automatic processing.
    """
    
    FILE_TYPE_CHOICES = [
        ('image', _('Image')),
        ('video', _('Video')),
        ('audio', _('Audio')),
        ('document', _('Document')),
        ('other', _('Other')),
    ]
    
    # Allowed file extensions for security
    ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg']
    ALLOWED_AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg']
    ALLOWED_DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']
    
    # File field with validation
    file = models.FileField(
        _('file'),
        upload_to=media_upload_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=(
                    ALLOWED_IMAGE_EXTENSIONS +
                    ALLOWED_VIDEO_EXTENSIONS +
                    ALLOWED_AUDIO_EXTENSIONS +
                    ALLOWED_DOCUMENT_EXTENSIONS
                )
            )
        ],
        help_text=_('Upload a file (images, videos, documents).')
    )
    
    # Metadata
    title = models.CharField(
        _('title'),
        max_length=200,
        help_text=_('Descriptive title for the media file.')
    )
    
    alt_text = models.CharField(
        _('alt text'),
        max_length=200,
        blank=True,
        help_text=_('Alternative text for accessibility (important for images).')
    )
    
    caption = models.TextField(
        _('caption'),
        blank=True,
        help_text=_('Caption or description for the media file.')
    )
    
    file_type = models.CharField(
        _('file type'),
        max_length=20,
        choices=FILE_TYPE_CHOICES,
        help_text=_('Type of media file.')
    )
    
    mime_type = models.CharField(
        _('MIME type'),
        max_length=100,
        blank=True,
        help_text=_('MIME type of the file.')
    )
    
    file_size = models.PositiveIntegerField(
        _('file size'),
        help_text=_('File size in bytes.')
    )
    
    # Image-specific fields
    width = models.PositiveIntegerField(
        _('width'),
        null=True,
        blank=True,
        help_text=_('Image width in pixels.')
    )
    
    height = models.PositiveIntegerField(
        _('height'),
        null=True,
        blank=True,
        help_text=_('Image height in pixels.')
    )
    
    # Relationships
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_media',
        verbose_name=_('uploaded by'),
        help_text=_('User who uploaded this file.')
    )
    
    # Metadata
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('media')
        verbose_name_plural = _('media')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['file_type']),
            models.Index(fields=['uploaded_by', 'created_at']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        """Extract and save file metadata."""
        if self.file:
            # Set file size
            self.file_size = self.file.size
            
            # Detect MIME type
            self.mime_type = mimetypes.guess_type(self.file.name)[0] or 'application/octet-stream'
            
            # Determine file type from extension
            ext = Path(self.file.name).suffix.lower().lstrip('.')
            if ext in self.ALLOWED_IMAGE_EXTENSIONS:
                self.file_type = 'image'
                # Extract image dimensions with security checks
                try:
                    # Verify file size before processing (prevent image bombs)
                    if self.file_size > 50 * 1024 * 1024:  # 50MB limit
                        raise ValueError('Image file too large')
                    
                    with Image.open(self.file) as img:
                        # Verify image is not a decompression bomb
                        img.verify()
                        # Reopen to get dimensions (verify() closes the file)
                        img = Image.open(self.file)
                        self.width, self.height = img.size
                        
                        # Additional safety: check pixel count
                        if self.width * self.height > 178956970:  # PIL's default limit
                            raise ValueError('Image dimensions too large')
                except Exception:
                    # If image processing fails, still allow upload but log warning
                    pass
            elif ext in self.ALLOWED_VIDEO_EXTENSIONS:
                self.file_type = 'video'
            elif ext in self.ALLOWED_AUDIO_EXTENSIONS:
                self.file_type = 'audio'
            elif ext in self.ALLOWED_DOCUMENT_EXTENSIONS:
                self.file_type = 'document'
            else:
                self.file_type = 'other'
            
            # Auto-set title from filename if not provided
            if not self.title:
                self.title = Path(self.file.name).stem.replace('_', ' ').title()
        
        super().save(*args, **kwargs)
    
    @property
    def is_image(self):
        """Check if the media is an image."""
        return self.file_type == 'image'
    
    @property
    def file_size_human(self):
        """Return file size in human-readable format."""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    
    def can_be_deleted_by(self, user):
        """Check if a user can delete this media file."""
        if user.is_superuser or user.is_editor:
            return True
        return self.uploaded_by == user
