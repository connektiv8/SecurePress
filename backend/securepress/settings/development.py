"""
Development settings for SecurePress.

These settings are used during local development.
Security settings are relaxed for easier debugging.
"""

from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Allow all hosts in development
ALLOWED_HOSTS = ['*']

# Development-specific installed apps
INSTALLED_APPS += [
    # 'django_extensions',  # Useful development tools (not installed)
]

# Development CORS - allow all origins
CORS_ALLOW_ALL_ORIGINS = True

# Email backend - print to console in development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Logging - more verbose in development
LOGGING['loggers']['django']['level'] = 'DEBUG'
LOGGING['loggers']['securepress']['level'] = 'DEBUG'

# Disable HTTPS redirects in development
SECURE_SSL_REDIRECT = False

# Allow HTTP cookies in development
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# Django Debug Toolbar (optional - not installed)
# if DEBUG:
#     INSTALLED_APPS += ['debug_toolbar']
#     MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')
#     INTERNAL_IPS = ['127.0.0.1', 'localhost']
