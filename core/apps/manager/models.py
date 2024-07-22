import uuid
from uuid import uuid4
from datetime import datetime

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from apps.core.models import Accounts

def ImagesUploadTo(instance, id):
    return f"uploads/files/{id}"


types = (('tour','Tour'),('airway','Airway'),('excursion','Excursion'))

class Tour(models.Model):
    uuid = models.CharField(_("UUID"), blank=True, null=True)
    type = models.CharField(_("Type"), choices=types, default="tour", max_length=128)
    name = models.CharField(_("Tour"), max_length=32, blank=False, null=False)
    banner = models.ImageField(_("Image"), upload_to=ImagesUploadTo, blank=False, null=False, max_length=256, help_text=_("Width 1920px x Height 2190px"),)
    location = models.CharField(_("Location"), max_length=256, blank=False, null=False)
    map = models.CharField(_("GoogleMaps"), max_length=1024, blank=False, null=False)
    date = models.DateField(_("Date"), default=timezone.now)
    description = models.TextField(_("Description"), max_length=128, blank=True, null=True)
    price = models.PositiveBigIntegerField(_("Ammount"), blank=True, default=0, help_text=_("$Ammount ($COP)"),)
    places = models.SmallIntegerField(_("Places"), null=False, blank=False, help_text="#Total Places Aviable")
    is_active = models.BooleanField(default=True, verbose_name='')

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Tour")
        verbose_name_plural = _("Tours")

    def __str__(self):
        return "Tour: %s" % (self.name)



class AttendeesTour(models.Model):
    account = models.ForeignKey(Accounts, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    fullname = models.CharField (_("Fullname"),max_length=128, null=False, blank=False)
    phone = models.CharField(_("Telefono"),max_length=64, null=False, blank=False)
    identification = models.CharField(_("CC"),max_length=32, null=False, blank=False)
    birthdate = models.DateField(_("Date"), default=timezone.now)
    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    state = models.BooleanField(default=True, verbose_name='')

    def __str__(self):
        return f"{self.voucher}"

    class Meta:
        indexes = [models.Index(fields=['voucher']),]
        verbose_name = _("Attendee")
        verbose_name_plural = _("Attendees")



class Lotteri(models.Model):
    lotteri = models.CharField(_("UUID"), blank=True, null=True)
    prize = models.CharField(_("Item"), max_length=128, null=False, blank=False)
    value = models.IntegerField(_("Investment"), default=1000, null=False, blank=False, help_text="$Investment Aprox-(SOP)")
    file = models.ImageField(_("Image"), upload_to=ImagesUploadTo, max_length=32, null=False, blank=False,help_text="Width-(1440px) - Height-(600px)")
    tickets = models.IntegerField (_("Tickets"), default=999, null=False, blank=False, help_text="#Tickets Total")
    description = models.TextField(_("Description"), max_length=128, blank=True, null=True)
    price = models.IntegerField(_("Ammount"), null=False, blank=False, help_text="$Ticket (COP)")
    winner = models.SmallIntegerField (_("Ticket-Winner"), null=True, blank=True, help_text="#Ticket Ganador")
    date = models.DateField(_("Date"), default=datetime(2000, 1, 1))
    sold = models.SmallIntegerField (_("Sold"), default=0, null=False, blank=False, help_text="#Tickets Totales")
    amount = models.IntegerField(_("Total"), default=0, null=False, blank=False, help_text="$Total (COP)")
    is_active = models.BooleanField(default=True, verbose_name='')

    def save(self, *args, **kwargs):
        last_id = Lotteri.objects.latest('id').id if Lotteri.objects.exists() else 0
        if not self.lotteri:
            self.lotteri = "LT" + str(1000 + last_id)
        super(Lotteri, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.lotteri}"

    class Meta:
        db_table = 'manager_lotteri'
        indexes = [models.Index(fields=['lotteri']),]
        verbose_name = _("Lotteri")
        verbose_name_plural = _("Lotteries")



class TicketsLotteri(models.Model):
    email = models.ForeignKey(Accounts, on_delete=models.CASCADE)
    lotteri = models.ForeignKey(Lotteri, on_delete=models.CASCADE)
    ticket = models.CharField (_("Ticket"),max_length=4, null=False, blank=False)
    date = models.DateField(_("Date"), default=timezone.now)
    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    state = models.BooleanField(default=True, verbose_name='')

    def save(self, *args, **kwargs):
        self.uuid = self.lotteri.lotteri if self.lotteri else None
        super(TicketsLotteri, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket}"

    class Meta:
        indexes = [models.Index(fields=['lotteri']),]
        verbose_name = _("Ticket")
        verbose_name_plural = _("Tickets")



class Schedule(models.Model):
    uuid = models.CharField(_("UUID"), blank=True, null=True)
    name = models.CharField(_("Schedule"), max_length=32, blank=False, null=False)

    date = models.DateField(_("Date"), default=timezone.now)
    is_active = models.BooleanField(default=True, verbose_name='')

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:8]
        
        if self.is_active:
            Schedule.objects.filter(is_active=True).exclude(id=self.id).update(is_active=False)
        
        super(Schedule, self).save(*args, **kwargs)

    class Meta:
        verbose_name = _("Schedule")
        verbose_name_plural = _("Schedules")

    def __str__(self):
        return "Schedule: %s" % (self.name)


class ItemsSchedule(models.Model):
    uuid = models.CharField(_("UUID"), blank=True, null=True)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)

    name = models.CharField(_("Schedule"), max_length=32, blank=False, null=False)
    banner = models.ImageField(_("Image"), upload_to=ImagesUploadTo, blank=False, null=False, max_length=256, help_text=_("Width 256px x Height 256px"),)
    location = models.CharField(_("Location"), max_length=256, blank=False, null=False)
    date = models.DateField(_("Date"), default=timezone.now)
    description = models.TextField(_("Description"), max_length=128, blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name='')

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:8]
        super(ItemsSchedule, self).save(*args, **kwargs)


    def __str__(self):
        return f"{self.uuid}"

    class Meta:
        indexes = [models.Index(fields=['schedule']),]
        verbose_name = _("Item")
        verbose_name_plural = _("Items")



class Advertisement(models.Model):
    uuid = models.CharField(_("UUID"), blank=True, null=True)
    name = models.CharField(_("Advertisement"), max_length=32, blank=False, null=False)
    banner = models.ImageField(_("Image"), upload_to=ImagesUploadTo, blank=False, null=False, max_length=256, help_text=_("Width 256px x Height 256px"),)
    date = models.DateField(_("Date"), default=timezone.now)
    description = models.TextField(_("Description"), max_length=128, blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name='')

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:8]
        super(Advertisement, self).save(*args, **kwargs)

    class Meta:
        verbose_name = _("Advertisement")
        verbose_name_plural = _("Advertisements")

    def __str__(self):
        return "Advertisement: %s" % (self.uuid)




