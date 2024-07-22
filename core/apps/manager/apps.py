from django.apps import AppConfig


class ManagerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.manager'
    verbose_name = ''

    def ready(self):
        from . import signals
