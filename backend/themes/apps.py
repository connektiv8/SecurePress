from django.apps import AppConfig


class ThemesConfig(AppConfig):
    """Configuration for the themes application."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'themes'
    verbose_name = 'Theme Manager'
