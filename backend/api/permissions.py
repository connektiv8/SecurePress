"""
Custom permissions for API endpoints.
"""

from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow authors to edit their content.
    Assumes the model instance has an `author` attribute.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for the author or editors/admins
        return (
            obj.author == request.user or
            request.user.is_editor or
            request.user.is_superuser
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners to edit their objects.
    Assumes the model instance has an `uploaded_by` or `user` attribute.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for the owner or editors/admins
        owner = getattr(obj, 'uploaded_by', None) or getattr(obj, 'user', None)
        return (
            owner == request.user or
            request.user.is_editor or
            request.user.is_superuser
        )


class IsEditorOrReadOnly(permissions.BasePermission):
    """
    Permission to only allow editors and admins to create/edit.
    """
    
    def has_permission(self, request, view):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for editors/admins
        return request.user and (
            request.user.is_editor or
            request.user.is_superuser
        )


class IsAdminUser(permissions.BasePermission):
    """
    Permission to only allow admin users.
    """
    
    def has_permission(self, request, view):
        return request.user and (
            request.user.is_admin or
            request.user.is_superuser
        )
