"""
Custom User model for SecurePress.

Extends Django's AbstractUser to use email as the primary identifier
and adds role-based permissions and security features.
"""

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password."""
        if not email:
            raise ValueError(_('The Email field must be set'))
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model for SecurePress.
    
    Uses email as the primary identifier instead of username.
    Includes role-based permissions and security features.
    """
    
    ROLE_CHOICES = [
        ('admin', _('Administrator')),
        ('editor', _('Editor')),
        ('author', _('Author')),
        ('subscriber', _('Subscriber')),
    ]
    
    # Remove username, use email instead
    username = None
    email = models.EmailField(_('email address'), unique=True)
    
    # Role-based permissions
    role = models.CharField(
        _('role'),
        max_length=20,
        choices=ROLE_CHOICES,
        default='subscriber',
        help_text=_('User role determines their permissions in the system.')
    )
    
    # Two-factor authentication
    two_factor_enabled = models.BooleanField(
        _('two-factor authentication enabled'),
        default=False,
        help_text=_('Whether two-factor authentication is enabled for this user.')
    )
    
    two_factor_secret = models.CharField(
        _('two-factor secret'),
        max_length=32,
        blank=True,
        null=True,
        help_text=_('Secret key for two-factor authentication.')
    )
    
    # Security tracking
    failed_login_attempts = models.IntegerField(
        _('failed login attempts'),
        default=0,
        help_text=_('Number of consecutive failed login attempts.')
    )
    
    last_failed_login = models.DateTimeField(
        _('last failed login'),
        null=True,
        blank=True,
        help_text=_('Timestamp of the last failed login attempt.')
    )
    
    account_locked_until = models.DateTimeField(
        _('account locked until'),
        null=True,
        blank=True,
        help_text=_('If set, the account is locked until this timestamp.')
    )
    
    # Profile information
    bio = models.TextField(
        _('bio'),
        blank=True,
        help_text=_('Short biography or description of the user.')
    )
    
    avatar = models.ImageField(
        _('avatar'),
        upload_to='avatars/',
        null=True,
        blank=True,
        help_text=_('User avatar image.')
    )
    
    # Metadata
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between."""
        return f"{self.first_name} {self.last_name}".strip() or self.email
    
    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name or self.email.split('@')[0]
    
    @property
    def is_admin(self):
        """Check if user is an admin."""
        return self.role == 'admin' or self.is_superuser
    
    @property
    def is_editor(self):
        """Check if user is an editor or higher."""
        return self.role in ['admin', 'editor'] or self.is_superuser
    
    @property
    def is_author(self):
        """Check if user is an author or higher."""
        return self.role in ['admin', 'editor', 'author'] or self.is_superuser
    
    def can_publish(self):
        """Check if user can publish content."""
        return self.is_editor
    
    def can_edit_others_content(self):
        """Check if user can edit other users' content."""
        return self.is_editor
