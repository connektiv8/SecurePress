"""
Media views for API.
"""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, parsers, viewsets
from rest_framework.permissions import IsAuthenticated

from api.permissions import IsOwnerOrReadOnly
from api.serializers import MediaListSerializer, MediaSerializer
from core.models import Media


class MediaViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Media model.
    
    Provides CRUD operations for media files with upload support.
    """
    
    queryset = Media.objects.select_related('uploaded_by')
    serializer_class = MediaSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['file_type', 'uploaded_by']
    search_fields = ['title', 'alt_text', 'caption']
    ordering_fields = ['created_at', 'title', 'file_size']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use list serializer for list action."""
        if self.action == 'list':
            return MediaListSerializer
        return MediaSerializer
