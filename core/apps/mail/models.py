import uuid
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

types = (('pending','Pendiente'),('send','Enviado'))

def TemplatesUploadTo(instance, id):
    return f"templates/mail/{id}"

class Marketing(models.Model):
    uuid = models.CharField(_("UUID"), unique=True)

    name = models.CharField(_("Nombre:"), max_length=64, blank=True, null=True)
    emails = models.IntegerField(_("Emails"), default=0, null=False, blank=False)
    status = models.CharField(_("Estado"), choices=types, default="pending", max_length=128)
    last_update = models.DateField(_("Fecha"),default=timezone.now)

    file = models.FileField(upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,
                            help_text="Template for Marketing")
    
    is_active = models.BooleanField(default=True, verbose_name='')

    def __str__(self):
        return f"{self.name}"

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:8]
            
        if self.is_active:
            Marketing.objects.filter(is_active=True).exclude(id=self.id).update(is_active=False)
        
        super(Marketing, self).save(*args, **kwargs)

    class Meta:
        verbose_name = _("Marketing")
        verbose_name_plural = _("Marketing")


class Emails(models.Model):
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    email = models.EmailField(_("Email"), null=False, blank=False, unique=True)
    date_joined = models.DateField(_("Fecha"),default=timezone.now, null=False, blank=False)

    def __str__(self):
        return f"{self.uuid}"

    class Meta:
        indexes = [models.Index(fields=['uuid','email']),]
        verbose_name = _("Email")
        verbose_name_plural = _("Emails")