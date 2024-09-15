import logging
import apps.src.models as model
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)

@receiver(pre_save, sender=model.Invoices)
def updateInvoices(sender, instance, **kwargs):
    obj = model.Invoices.objects.filter(pk=instance.pk).first()
    if obj and not kwargs.get('created', False):
        if obj.state != "done" and instance.state == "done":
            print("Actualizo")
            try:
                user = instance.account
                amount = instance.amount
                user.balance += amount
                user.save()
                
            except Exception as e:
                logger.error("%s", e, exc_info=True)