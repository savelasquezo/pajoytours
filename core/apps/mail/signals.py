import os, base64, logging
from django.conf import settings
from django.utils import timezone
from django.contrib import messages

from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver

import apps.mail.models as model
from apps.core.functions import sendEmail

logger = logging.getLogger(__name__)

@receiver(post_save, sender=model.Marketing)
def signalMarketing(sender, instance, **kwargs):

    try:
        if instance.is_active and instance.status == "send":

            email_queryset = model.Emails.objects.all()
            email_list = [email.email for email in email_queryset]

            instance.is_active = False
            instance.emails = len(email_list)
            instance.last_update = timezone.now()
            instance.save()

            sendEmail(instance.name, instance.file, email_list, data=None)

    except Exception as e:
        logger.error("%s", e, exc_info=True)