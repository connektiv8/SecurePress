"""
Media serializers for API.
"""

from rest_framework import serializers

from core.models import Media

from .user import UserListSerializer


class MediaSerializer(serializers.ModelSerializer):
    """Serializer for Media model."""
    
    uploaded_by = UserListSerializer(read_only=True)
    uploaded_by_id = serializers.IntegerField(write_only=True, required=False)
    file_size_human = serializers.CharField(read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Media
        fields = [
            'id',
            'file',
            'file_url',
            'title',
            'alt_text',
            'caption',
            'file_type',
            'mime_type',
            'file_size',
            'file_size_human',
            'width',
            'height',
            'uploaded_by',
            'uploaded_by_id',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'file_type',
            'mime_type',
            'file_size',
            'width',
            'height',
            'created_at',
            'updated_at',
        ]
    
    def get_file_url(self, obj):
        """Get absolute URL for the file."""
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
    
    def create(self, validated_data):
        """Create media with uploader from request."""
        if 'uploaded_by_id' not in validated_data:
            validated_data['uploaded_by'] = self.context['request'].user
        else:
            uploaded_by_id = validated_data.pop('uploaded_by_id')
            from core.models import User
            validated_data['uploaded_by'] = User.objects.get(id=uploaded_by_id)
        
        return Media.objects.create(**validated_data)


class MediaListSerializer(serializers.ModelSerializer):
    """Simplified serializer for media lists."""
    
    file_size_human = serializers.CharField(read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Media
        fields = [
            'id',
            'file_url',
            'title',
            'alt_text',
            'file_type',
            'file_size_human',
            'width',
            'height',
            'created_at',
        ]
        read_only_fields = fields
    
    def get_file_url(self, obj):
        """Get absolute URL for the file."""
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
