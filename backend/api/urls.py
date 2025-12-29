"""
URL configuration for API endpoints.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, MediaViewSet, PageViewSet, PostViewSet, TagViewSet, UserViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'pages', PageViewSet, basename='page')
router.register(r'media', MediaViewSet, basename='media')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', TagViewSet, basename='tag')

urlpatterns = [
    path('', include(router.urls)),
]
