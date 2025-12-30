"""
Post views for API.
"""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from api.permissions import IsAuthorOrReadOnly
from api.serializers import CategorySerializer, PostSerializer, TagSerializer
from core.models import Category, Post, Tag


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Post model.
    
    Provides CRUD operations for posts with filtering, searching, and pagination.
    """
    
    queryset = Post.objects.select_related('author', 'featured_image').prefetch_related('categories', 'tags')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'author', 'categories', 'tags']
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'published_at', 'view_count', 'title']
    ordering = ['-published_at']
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Filter published posts for non-authenticated users."""
        queryset = super().get_queryset()
        
        # Non-authenticated users only see published posts
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(status='published')
        # Non-editors only see their own drafts plus published posts
        elif not self.request.user.is_editor:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(status='published') | Q(author=self.request.user)
            )
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, slug=None):
        """Increment view count for a post."""
        post = self.get_object()
        post.view_count += 1
        post.save(update_fields=['view_count'])
        return Response({'view_count': post.view_count})


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category model."""
    
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    lookup_field = 'slug'


class TagViewSet(viewsets.ModelViewSet):
    """ViewSet for Tag model."""
    
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    lookup_field = 'slug'
