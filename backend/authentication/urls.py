"""
URL configuration for authentication endpoints.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import change_password_view, login_view, logout_view, register_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('register/', register_view, name='register'),
    path('change-password/', change_password_view, name='change-password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
