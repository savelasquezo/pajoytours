from django.apps import AppConfig


class SiteConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.site'
    verbose_name = ''

    def ready(self):
        from . import signals
''