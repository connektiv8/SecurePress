"""
Views for authentication endpoints using Knox tokens.
"""

from django.contrib.auth import login
from django_ratelimit.decorators import ratelimit
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from knox.views import LogoutView as KnoxLogoutView
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import ChangePasswordSerializer, LoginSerializer, RegisterSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/m', method='POST')
@ratelimit(key='user_or_ip', rate='10/m', method='POST')
def login_view(request):
    """
    User login endpoint using Knox tokens.
    
    Rate limited to 5 attempts per minute per IP address
    and 10 attempts per minute per user/IP combination.
    """
    serializer = LoginSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    
    user = serializer.validated_data['user']
    login(request, user)
    
    # Create Knox token
    instance, token = AuthToken.objects.create(user)
    
    return Response({
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
        },
        'token': token,
        'expiry': instance.expiry,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    User logout endpoint - deletes the Knox token.
    """
    request._auth.delete()
    return Response({'detail': 'Successfully logged out.'})


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='3/h', method='POST')
def register_view(request):
    """
    User registration endpoint.
    
    Rate limited to 3 registrations per hour per IP address.
    """
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = serializer.save()
    
    # Create Knox token
    instance, token = AuthToken.objects.create(user)
    
    return Response({
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
        },
        'token': token,
        'expiry': instance.expiry,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """
    Change password endpoint.
    
    Requires authentication and old password verification.
    Invalidates all existing tokens and creates a new one.
    """
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    
    user = request.user
    user.set_password(serializer.validated_data['new_password'])
    user.save()
    
    # Delete all existing tokens for this user (force re-login on all devices)
    AuthToken.objects.filter(user=user).delete()
    
    # Create a new token
    instance, token = AuthToken.objects.create(user)
    
    return Response({
        'detail': 'Password changed successfully.',
        'token': token,
        'expiry': instance.expiry,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_all_view(request):
    """
    Logout from all devices - deletes all Knox tokens for the user.
    """
    AuthToken.objects.filter(user=request.user).delete()
    return Response({'detail': 'Successfully logged out from all devices.'})
