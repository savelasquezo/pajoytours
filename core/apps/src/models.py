import secrets, string
from datetime import datetime, timedelta

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from django.core.exceptions import ObjectDoesNotExist

from apps.auth.models import Account

def ImageUploadTo(instance, id):
    return f"media/lottery/{id}"

class Lottery(models.Model):

    lottery = models.CharField(_("ID"), max_length=128, unique=True, null=False, blank=False)

    prize = models.CharField(_("Item"), max_length=128, null=False, blank=False)
    value = models.IntegerField(_("Investment"), default=1000, null=False, blank=False, help_text="$Investment Aprox-(SOP)")

    file = models.ImageField(_("Image"), upload_to=ImageUploadTo, max_length=32, null=False, blank=False,
        help_text="Width-(1440px) - Height-(600px)")

    tickets = models.SmallIntegerField (_("Tickets"), default=999, null=False, blank=False, help_text="#Tickets Total")
    price = models.SmallIntegerField(_("Ammount"), null=False, blank=False, help_text="$Ticket (COP)")
    
    winner = models.SmallIntegerField (_("Ticket-Winner"), null=True, blank=True, help_text="#Ticket Ganador")

    date = models.DateField(_("Date"), default=datetime(2000, 1, 1))

    sold = models.SmallIntegerField (_("Sold"), default=0, null=False, blank=False, help_text="#Tickets Totales")

    amount = models.IntegerField(_("Total"), default=0, null=False, blank=False, help_text="$Total (COP)")

    is_active = models.BooleanField(default=True, verbose_name='')

    def save(self, *args, **kwargs):
        try:
            last_id = Lottery.objects.latest('id').id
        except ObjectDoesNotExist:
            last_id = 0

        if not self.lottery:
            self.lottery = "I0" + str(100 + last_id)
            self.date_results = datetime(2000, 1, 1)
            
        super(Lottery, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.lottery}"

    class Meta:
        indexes = [models.Index(fields=['lottery']),]
        verbose_name = _("Lottery")
        verbose_name_plural = _("Lotterys")



class TicketsLottery(models.Model):
    email = models.ForeignKey(Account, on_delete=models.CASCADE)
    lottery = models.ForeignKey(Lottery, on_delete=models.CASCADE)

    uuid = models.CharField(_("UUID"), max_length=32, null=True, blank=True)
    ticket = models.CharField (_("Ticket"),max_length=4, null=False, blank=False, help_text="#Ticket")
    date = models.DateField(_("Date"), default=timezone.now)
    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    state = models.BooleanField(default=True, verbose_name='')

    def save(self, *args, **kwargs):
        self.uuid = self.lottery.lottery if self.lottery else None
        super(TicketsLottery, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket}"

    class Meta:
        indexes = [models.Index(fields=['lottery']),]
        verbose_name = _("Ticket")
        verbose_name_plural = _("Tickets")