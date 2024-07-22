import logging
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)

def sendEmail(subject, template_url, email_list, data=None):
    try:
        template_path = template_url.path if hasattr(template_url, 'path') else template_url
        context_data = data if data is not None else {}

        email = EmailMultiAlternatives(subject, '', settings.EMAIL_HOST_USER, email_list)
        email.attach_alternative(render_to_string(template_path, context_data), 'text/html')
        email.send()

    except Exception as e:
        logger.error("%s", e, exc_info=True)
