# SecurePress Plugins Directory

This directory contains optional plugins that extend SecurePress functionality.

## Available Plugins

- **SecureCommerce**: Advanced e-commerce functionality (coming soon)

## Plugin Structure

Each plugin should follow this structure:
```
plugin_name/
├── __init__.py
├── plugin.json          # Plugin metadata
├── models/              # Database models
├── serializers/         # API serializers
├── views/               # API views
├── urls.py              # URL routing
└── README.md            # Plugin documentation
```
