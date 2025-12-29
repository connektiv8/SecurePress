"""
Post serializers for API.
"""

from rest_framework import serializers

from core.models import Category, Post, Tag

from .user import UserListSerializer


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent', 'created_at']
        read_only_fields = ['id', 'created_at']


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model."""
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'created_at']
        read_only_fields = ['id', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    """Serializer for Post model."""
    
    author = UserListSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True, required=False)
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'slug',
            'content',
            'excerpt',
            'author',
            'author_id',
            'featured_image',
            'categories',
            'category_ids',
            'tags',
            'tag_ids',
            'status',
            'published_at',
            'meta_description',
            'meta_keywords',
            'view_count',
            'allow_comments',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'view_count', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        """Create post with many-to-many relationships."""
        category_ids = validated_data.pop('category_ids', [])
        tag_ids = validated_data.pop('tag_ids', [])
        
        # Set author from request if not provided
        if 'author_id' not in validated_data:
            validated_data['author'] = self.context['request'].user
        else:
            author_id = validated_data.pop('author_id')
            from core.models import User
            validated_data['author'] = User.objects.get(id=author_id)
        
        post = Post.objects.create(**validated_data)
        
        if category_ids:
            post.categories.set(category_ids)
        if tag_ids:
            post.tags.set(tag_ids)
        
        return post
    
    def update(self, instance, validated_data):
        """Update post with many-to-many relationships."""
        category_ids = validated_data.pop('category_ids', None)
        tag_ids = validated_data.pop('tag_ids', None)
        validated_data.pop('author_id', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if category_ids is not None:
            instance.categories.set(category_ids)
        if tag_ids is not None:
            instance.tags.set(tag_ids)
        
        instance.save()
        return instance


class PostListSerializer(serializers.ModelSerializer):
    """Simplified serializer for post lists."""
    
    author = UserListSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'author',
            'featured_image',
            'categories',
            'tags',
            'status',
            'published_at',
            'view_count',
            'created_at',
        ]
        read_only_fields = fields
