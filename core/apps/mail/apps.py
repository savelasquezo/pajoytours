from django.apps import AppConfig


class MailConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.mail'
    verbose_name = ''

    def ready(self):
        from . import signals

