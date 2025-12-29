from django.apps import AppConfig


class MarketplaceConfig(AppConfig):
    """Configuration for the marketplace application."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'marketplace'
    verbose_name = 'App Marketplace'
