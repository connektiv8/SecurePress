"""
URL configuration for SecurePress project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint for monitoring and load balancers.
    """
    return Response({'status': 'healthy'}, status=status.HTTP_200_OK)


urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # Health check
    path('api/health/', health_check, name='health-check'),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API endpoints
    path('api/auth/', include('authentication.urls')),
    path('api/', include('api.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Custom admin site configuration
admin.site.site_header = 'SecurePress Administration'
admin.site.site_title = 'SecurePress Admin'
admin.site.index_title = 'Welcome to SecurePress Administration'
