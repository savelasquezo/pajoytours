from django.apps import AppConfig


class SrcConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.src'
    verbose_name = ''

    def ready(self):
        from . import signals