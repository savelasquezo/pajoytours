import uuid
from uuid import uuid4

from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.core.models import Accounts

states = (('pending','Pending'),('done','Done'),('error','Error'))
methods = (('fiat','Fiat'),('bold','Bold'))

class Invoices(models.Model):
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    account = models.ForeignKey(Accounts, on_delete=models.CASCADE)
    amount = models.FloatField(_("Ammount"),blank=False,null=False,default=0, help_text=_("Ammount of Invoice (COP)"),)
    date = models.DateField(_("Date"), default=timezone.now)
    method = models.CharField(_("Method"), choices=methods, max_length=128, null=False, blank=False)
    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    state = models.CharField(verbose_name='',choices=states, default="pending", max_length=16)

    def __str__(self):
        return f"{self.voucher}"

    class Meta:
        indexes = [models.Index(fields=['account','voucher']),]
        verbose_name = _("Invoice")
        verbose_name_plural = _("Invoices")


