"""
Page views for API.
"""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from api.permissions import IsAuthorOrReadOnly
from api.serializers import PageListSerializer, PageSerializer
from core.models import Page


class PageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Page model.
    
    Provides CRUD operations for pages with filtering and searching.
    """
    
    queryset = Page.objects.select_related('author', 'parent', 'featured_image')
    serializer_class = PageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'template', 'show_in_menu', 'parent']
    search_fields = ['title', 'content']
    ordering_fields = ['menu_order', 'title', 'created_at']
    ordering = ['menu_order', 'title']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        """Use list serializer for list action."""
        if self.action == 'list':
            return PageListSerializer
        return PageSerializer
    
    def get_queryset(self):
        """Filter published pages for non-authenticated users."""
        queryset = super().get_queryset()
        
        # Non-authenticated users only see published pages
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(status='published')
        # Non-editors only see their own drafts plus published pages
        elif not self.request.user.is_editor:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(status='published') | Q(author=self.request.user)
            )
        
        return queryset
