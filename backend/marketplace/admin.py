"""
Django Admin configuration for marketplace models.
"""

from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import AppReview, AppVersion, MarketplaceApp, SecurityVettingReport


@admin.register(MarketplaceApp)
class MarketplaceAppAdmin(admin.ModelAdmin):
    """Admin interface for Marketplace Apps."""
    
    list_display = (
        'name', 'app_type', 'developer', 'status', 'security_level', 
        'security_score', 'rating_average', 'download_count', 'is_verified'
    )
    list_filter = ('app_type', 'status', 'security_level', 'is_verified', 'is_featured')
    search_fields = ('name', 'slug', 'description', 'developer__email')
    readonly_fields = (
        'download_count', 'active_installations', 'rating_average', 
        'rating_count', 'created_at', 'updated_at'
    )
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('name', 'slug', 'description', 'app_type')
        }),
        (_('Developer'), {
            'fields': ('developer', 'developer_website', 'support_email')
        }),
        (_('Version & Pricing'), {
            'fields': ('current_version', 'is_free', 'price')
        }),
        (_('Security & Vetting'), {
            'fields': (
                'status', 'security_level', 'security_score',
                'code_scan_passed', 'dependency_scan_passed',
                'manual_review_passed', 'penetration_test_passed',
                'reviewed_by', 'reviewed_at'
            )
        }),
        (_('Review Notes'), {
            'fields': ('review_notes', 'rejection_reason'),
            'classes': ('collapse',)
        }),
        (_('URLs'), {
            'fields': ('homepage_url', 'documentation_url', 'source_code_url')
        }),
        (_('Media'), {
            'fields': ('icon', 'banner')
        }),
        (_('Requirements'), {
            'fields': (
                'min_securepress_version', 'max_securepress_version',
                'requires_plugins'
            ),
            'classes': ('collapse',)
        }),
        (_('Metadata'), {
            'fields': ('features', 'tags', 'license')
        }),
        (_('Flags'), {
            'fields': (
                'is_featured', 'is_verified', 'requires_api_key',
                'collects_data'
            )
        }),
        (_('Statistics'), {
            'fields': (
                'download_count', 'active_installations',
                'rating_average', 'rating_count'
            ),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_app', 'reject_app', 'feature_app']
    
    def approve_app(self, request, queryset):
        """Approve selected apps."""
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} app(s) approved.')
    approve_app.short_description = _('Approve selected apps')
    
    def reject_app(self, request, queryset):
        """Reject selected apps."""
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} app(s) rejected.')
    reject_app.short_description = _('Reject selected apps')
    
    def feature_app(self, request, queryset):
        """Feature selected apps."""
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} app(s) featured.')
    feature_app.short_description = _('Feature selected apps')


@admin.register(AppVersion)
class AppVersionAdmin(admin.ModelAdmin):
    """Admin interface for App Versions."""
    
    list_display = (
        'app', 'version', 'is_stable', 'is_active',
        'security_scan_passed', 'download_count', 'created_at'
    )
    list_filter = ('is_stable', 'is_active', 'security_scan_passed')
    search_fields = ('app__name', 'version', 'release_notes')
    readonly_fields = ('package_size', 'download_count', 'created_at')
    
    fieldsets = (
        (None, {
            'fields': ('app', 'version', 'release_notes')
        }),
        (_('Package'), {
            'fields': (
                'package_file', 'package_checksum', 'package_size'
            )
        }),
        (_('Security'), {
            'fields': (
                'security_scan_passed', 'security_scan_date',
                'security_issues_found'
            )
        }),
        (_('Requirements'), {
            'fields': ('min_securepress_version', 'requires_plugins'),
            'classes': ('collapse',)
        }),
        (_('Status'), {
            'fields': ('is_stable', 'is_active', 'download_count')
        }),
    )


@admin.register(AppReview)
class AppReviewAdmin(admin.ModelAdmin):
    """Admin interface for App Reviews."""
    
    list_display = (
        'app', 'user', 'rating', 'title', 'verified_purchase',
        'is_approved', 'is_flagged', 'created_at'
    )
    list_filter = ('rating', 'verified_purchase', 'is_approved', 'is_flagged')
    search_fields = ('app__name', 'user__email', 'title', 'review')
    readonly_fields = ('created_at', 'updated_at')
    
    actions = ['approve_reviews', 'flag_reviews']
    
    def approve_reviews(self, request, queryset):
        """Approve selected reviews."""
        updated = queryset.update(is_approved=True, is_flagged=False)
        self.message_user(request, f'{updated} review(s) approved.')
    approve_reviews.short_description = _('Approve selected reviews')
    
    def flag_reviews(self, request, queryset):
        """Flag selected reviews."""
        updated = queryset.update(is_flagged=True)
        self.message_user(request, f'{updated} review(s) flagged.')
    flag_reviews.short_description = _('Flag selected reviews')


@admin.register(SecurityVettingReport)
class SecurityVettingReportAdmin(admin.ModelAdmin):
    """Admin interface for Security Vetting Reports."""
    
    list_display = (
        'app', 'version', 'reviewer', 'security_score',
        'risk_level', 'passed', 'started_at', 'completed_at'
    )
    list_filter = ('risk_level', 'passed')
    search_fields = ('app__name', 'reviewer__email')
    readonly_fields = ('started_at',)
    
    fieldsets = (
        (None, {
            'fields': ('app', 'version', 'reviewer')
        }),
        (_('Automated Scans'), {
            'fields': (
                'static_analysis_results',
                'dependency_scan_results',
                'vulnerability_scan_results'
            ),
            'classes': ('collapse',)
        }),
        (_('Manual Review'), {
            'fields': (
                'code_review_notes',
                'security_concerns',
                'recommendations'
            )
        }),
        (_('Testing'), {
            'fields': (
                'penetration_test_results',
                'performance_test_results'
            ),
            'classes': ('collapse',)
        }),
        (_('Assessment'), {
            'fields': ('security_score', 'risk_level', 'passed')
        }),
        (_('Timeline'), {
            'fields': ('started_at', 'completed_at')
        }),
    )
