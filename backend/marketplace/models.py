"""
Marketplace models for apps, themes, and plugins with security vetting.
"""

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


class MarketplaceApp(models.Model):
    """
    Marketplace application with strict security vetting.
    """
    
    APP_TYPE_CHOICES = [
        ('plugin', _('Plugin')),
        ('theme', _('Theme')),
        ('extension', _('Extension')),
    ]
    
    STATUS_CHOICES = [
        ('submitted', _('Submitted')),
        ('under_review', _('Under Review')),
        ('security_review', _('Security Review')),
        ('approved', _('Approved')),
        ('rejected', _('Rejected')),
        ('suspended', _('Suspended')),
    ]
    
    SECURITY_LEVEL_CHOICES = [
        ('low', _('Low Risk')),
        ('medium', _('Medium Risk')),
        ('high', _('High Risk')),
        ('critical', _('Critical Risk')),
    ]
    
    # Basic Information
    name = models.CharField(_('name'), max_length=200, unique=True)
    slug = models.SlugField(_('slug'), max_length=200, unique=True)
    description = models.TextField(_('description'))
    app_type = models.CharField(_('app type'), max_length=20, choices=APP_TYPE_CHOICES)
    
    # Developer Information
    developer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='marketplace_apps',
        verbose_name=_('developer')
    )
    developer_website = models.URLField(_('developer website'), blank=True)
    support_email = models.EmailField(_('support email'))
    
    # Version & Downloads
    current_version = models.CharField(_('current version'), max_length=50)
    download_count = models.PositiveIntegerField(_('download count'), default=0)
    active_installations = models.PositiveIntegerField(_('active installations'), default=0)
    
    # Pricing
    is_free = models.BooleanField(_('is free'), default=True)
    price = models.DecimalField(
        _('price'),
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Security & Vetting
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='submitted'
    )
    security_level = models.CharField(
        _('security level'),
        max_length=20,
        choices=SECURITY_LEVEL_CHOICES,
        null=True,
        blank=True
    )
    security_score = models.IntegerField(
        _('security score'),
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        null=True,
        blank=True,
        help_text=_('0-100, higher is better')
    )
    
    # Vetting Information
    submitted_at = models.DateTimeField(_('submitted at'), null=True, blank=True)
    reviewed_at = models.DateTimeField(_('reviewed at'), null=True, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_apps',
        verbose_name=_('reviewed by')
    )
    
    # Security Checks
    code_scan_passed = models.BooleanField(_('code scan passed'), default=False)
    dependency_scan_passed = models.BooleanField(_('dependency scan passed'), default=False)
    manual_review_passed = models.BooleanField(_('manual review passed'), default=False)
    penetration_test_passed = models.BooleanField(_('penetration test passed'), default=False)
    
    # Review Notes
    review_notes = models.TextField(_('review notes'), blank=True)
    rejection_reason = models.TextField(_('rejection reason'), blank=True)
    
    # App Details
    homepage_url = models.URLField(_('homepage URL'), blank=True)
    documentation_url = models.URLField(_('documentation URL'), blank=True)
    source_code_url = models.URLField(_('source code URL'), blank=True)
    license = models.CharField(_('license'), max_length=100)
    
    # Screenshots & Media
    icon = models.ImageField(_('icon'), upload_to='marketplace/icons/', null=True, blank=True)
    banner = models.ImageField(_('banner'), upload_to='marketplace/banners/', null=True, blank=True)
    
    # Requirements
    min_securepress_version = models.CharField(_('minimum SecurePress version'), max_length=50)
    max_securepress_version = models.CharField(_('maximum SecurePress version'), max_length=50, blank=True)
    requires_plugins = models.JSONField(_('requires plugins'), default=list, blank=True)
    
    # Features & Tags
    features = models.JSONField(_('features'), default=list, blank=True)
    tags = models.JSONField(_('tags'), default=list, blank=True)
    
    # Ratings
    rating_average = models.DecimalField(
        _('average rating'),
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    rating_count = models.PositiveIntegerField(_('rating count'), default=0)
    
    # Flags
    is_featured = models.BooleanField(_('is featured'), default=False)
    is_verified = models.BooleanField(_('is verified'), default=False)
    requires_api_key = models.BooleanField(_('requires API key'), default=False)
    collects_data = models.BooleanField(_('collects user data'), default=False)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('marketplace app')
        verbose_name_plural = _('marketplace apps')
        ordering = ['-rating_average', '-download_count']
        indexes = [
            models.Index(fields=['status', 'app_type']),
            models.Index(fields=['security_level']),
            models.Index(fields=['-rating_average', '-download_count']),
        ]
    
    def __str__(self):
        return self.name
    
    @property
    def is_approved(self):
        """Check if app is approved for marketplace."""
        return self.status == 'approved'
    
    @property
    def passed_all_security_checks(self):
        """Check if app passed all security checks."""
        return (
            self.code_scan_passed and
            self.dependency_scan_passed and
            self.manual_review_passed and
            self.penetration_test_passed
        )


class AppVersion(models.Model):
    """
    Version history for marketplace apps.
    """
    
    app = models.ForeignKey(
        MarketplaceApp,
        on_delete=models.CASCADE,
        related_name='versions'
    )
    
    version = models.CharField(_('version'), max_length=50)
    release_notes = models.TextField(_('release notes'))
    
    # File
    package_file = models.FileField(_('package file'), upload_to='marketplace/packages/')
    package_checksum = models.CharField(_('package checksum (SHA256)'), max_length=64)
    package_size = models.PositiveIntegerField(_('package size (bytes)'))
    
    # Security
    security_scan_passed = models.BooleanField(_('security scan passed'), default=False)
    security_scan_date = models.DateTimeField(_('security scan date'), null=True, blank=True)
    security_issues_found = models.JSONField(_('security issues found'), default=list, blank=True)
    
    # Requirements
    min_securepress_version = models.CharField(_('minimum SecurePress version'), max_length=50)
    requires_plugins = models.JSONField(_('requires plugins'), default=list, blank=True)
    
    # Metadata
    is_stable = models.BooleanField(_('is stable'), default=True)
    is_active = models.BooleanField(_('is active'), default=True)
    
    download_count = models.PositiveIntegerField(_('download count'), default=0)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('app version')
        verbose_name_plural = _('app versions')
        ordering = ['-created_at']
        unique_together = [['app', 'version']]
    
    def __str__(self):
        return f"{self.app.name} v{self.version}"


class AppReview(models.Model):
    """
    User reviews for marketplace apps.
    """
    
    app = models.ForeignKey(
        MarketplaceApp,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='app_reviews'
    )
    
    rating = models.IntegerField(
        _('rating'),
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    
    title = models.CharField(_('title'), max_length=200)
    review = models.TextField(_('review'))
    
    # Verification
    verified_purchase = models.BooleanField(_('verified purchase'), default=False)
    
    # Moderation
    is_approved = models.BooleanField(_('is approved'), default=False)
    is_flagged = models.BooleanField(_('is flagged'), default=False)
    
    # Helpfulness
    helpful_count = models.PositiveIntegerField(_('helpful count'), default=0)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('app review')
        verbose_name_plural = _('app reviews')
        ordering = ['-created_at']
        unique_together = [['app', 'user']]
    
    def __str__(self):
        return f"{self.user.email} - {self.app.name} ({self.rating}★)"


class SecurityVettingReport(models.Model):
    """
    Detailed security vetting report for marketplace apps.
    """
    
    app = models.ForeignKey(
        MarketplaceApp,
        on_delete=models.CASCADE,
        related_name='security_reports'
    )
    
    version = models.ForeignKey(
        AppVersion,
        on_delete=models.CASCADE,
        related_name='security_reports',
        null=True,
        blank=True
    )
    
    # Reviewer
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='security_reviews'
    )
    
    # Automated Scans
    static_analysis_results = models.JSONField(_('static analysis results'), default=dict)
    dependency_scan_results = models.JSONField(_('dependency scan results'), default=dict)
    vulnerability_scan_results = models.JSONField(_('vulnerability scan results'), default=dict)
    
    # Manual Review
    code_review_notes = models.TextField(_('code review notes'))
    security_concerns = models.JSONField(_('security concerns'), default=list)
    recommendations = models.TextField(_('recommendations'))
    
    # Test Results
    penetration_test_results = models.TextField(_('penetration test results'), blank=True)
    performance_test_results = models.JSONField(_('performance test results'), default=dict, blank=True)
    
    # Overall Assessment
    security_score = models.IntegerField(
        _('security score'),
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    risk_level = models.CharField(
        _('risk level'),
        max_length=20,
        choices=MarketplaceApp.SECURITY_LEVEL_CHOICES
    )
    
    passed = models.BooleanField(_('passed vetting'), default=False)
    
    # Timestamps
    started_at = models.DateTimeField(_('started at'), auto_now_add=True)
    completed_at = models.DateTimeField(_('completed at'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('security vetting report')
        verbose_name_plural = _('security vetting reports')
        ordering = ['-started_at']
    
    def __str__(self):
        return f"Security Report: {self.app.name} - {self.security_score}/100"
