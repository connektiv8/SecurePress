"""
URL configuration for authentication endpoints.
"""

from django.urls import path

from .views import change_password_view, login_view, logout_all_view, logout_view, register_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('logout-all/', logout_all_view, name='logout-all'),
    path('register/', register_view, name='register'),
    path('change-password/', change_password_view, name='change-password'),
]
