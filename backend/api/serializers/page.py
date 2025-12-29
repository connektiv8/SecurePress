"""
Page serializers for API.
"""

from rest_framework import serializers

from core.models import Page

from .user import UserListSerializer


class PageSerializer(serializers.ModelSerializer):
    """Serializer for Page model."""
    
    author = UserListSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True, required=False)
    breadcrumb = serializers.SerializerMethodField()
    
    class Meta:
        model = Page
        fields = [
            'id',
            'title',
            'slug',
            'content',
            'author',
            'author_id',
            'parent',
            'featured_image',
            'status',
            'template',
            'menu_order',
            'show_in_menu',
            'meta_description',
            'meta_keywords',
            'published_at',
            'created_at',
            'updated_at',
            'breadcrumb',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'breadcrumb']
    
    def get_breadcrumb(self, obj):
        """Get breadcrumb trail for the page."""
        return [{'id': page.id, 'title': page.title, 'slug': page.slug} 
                for page in obj.get_breadcrumb()]
    
    def create(self, validated_data):
        """Create page with author from request."""
        if 'author_id' not in validated_data:
            validated_data['author'] = self.context['request'].user
        else:
            author_id = validated_data.pop('author_id')
            from core.models import User
            validated_data['author'] = User.objects.get(id=author_id)
        
        return Page.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        """Update page."""
        validated_data.pop('author_id', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class PageListSerializer(serializers.ModelSerializer):
    """Simplified serializer for page lists."""
    
    author = UserListSerializer(read_only=True)
    
    class Meta:
        model = Page
        fields = [
            'id',
            'title',
            'slug',
            'author',
            'status',
            'template',
            'menu_order',
            'show_in_menu',
            'created_at',
        ]
        read_only_fields = fields
