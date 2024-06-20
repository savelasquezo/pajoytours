import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

states = (('pending','Pending'),('done','Done'),('error','Error'))
methods = (('fiat','Fiat'),('bold','Bold'))

def ImageUploadTo(instance, id):
    return f"uploads/files/{id}"

class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('¡Email Obligatorio!')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class Account(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True, primary_key=True)
    email = models.EmailField(_("Email"),unique=True)
    phone = models.CharField(_("Telefono"),max_length=64, unique=True, null=False, blank=False)
    location = models.CharField(_("Ubicacion"),max_length=256, null=True, blank=True)
    balance = models.FloatField(_("Balance"),default=0, null=True, blank=True, help_text="Saldo Disponible $USD")
    date_joined = models.DateField(_("Fecha"),default=timezone.now)
    last_joined = models.DateField(_("Ultimo Ingreso"),default=timezone.now)
    frame = models.CharField(_("Avatar"),default=0,max_length=2, null=True, blank=True)

    is_active = models.BooleanField(default=False, verbose_name="")
    is_staff = models.BooleanField(default=False, verbose_name="")

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone']

    def __str__(self):
        return f"{self.email}"

    class Meta:
        indexes = [models.Index(fields=['email']),]
        verbose_name = _("Account")
        verbose_name_plural = _("Accounts")


class Invoice(models.Model):
    id = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True, primary_key=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.FloatField(_("Ammount"),blank=False,null=False,default=0, help_text=_("Ammount of Invoice (COP)"),)
    date = models.DateField(_("Date"), default=timezone.now)
    method = models.CharField(_("Method"), choices=methods, max_length=128, null=False, blank=False)
    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    state = models.CharField(verbose_name='',choices=states, default="pending", max_length=16)

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:12]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.voucher}"

    class Meta:
        indexes = [models.Index(fields=['account','voucher']),]
        verbose_name = _("Invoice")
        verbose_name_plural = _("Invoices")


class Settings(models.Model):
    default = models.CharField(_("Settings"), max_length=32, unique=True, blank=True, null=True, default="Settings")

    nit = models.CharField(_("NIT"), max_length=64, blank=True, null=True)
    phone = models.CharField(_("Telefono"), max_length=64, blank=True, null=True)
    email = models.EmailField(_("Correo"), max_length=254, blank=True, null=True)
    address = models.CharField(_("Address"), max_length=64, blank=True, null=True)

    twitter = models.URLField(_("Twitter"), max_length=128, blank=True, null=True)
    facebook = models.URLField(_("Facebook"), max_length=128, blank=True, null=True)
    instagram = models.URLField(_("Instagram"), max_length=128, blank=True, null=True)

    def __str__(self):
        return f"{self.default}"

    class Meta:
        verbose_name = _("Setting")
        verbose_name_plural = _("Settings")


class ImagenSlider(models.Model):
    settings = models.ForeignKey(Settings, on_delete=models.CASCADE)
    file = models.ImageField(_("Imagen"), upload_to=ImageUploadTo, max_length=32, null=True, blank=True,
                                help_text="Width-(1340px) - Height-(500px)")

    def __str__(self):
        return f"{self.id}"

    class Meta:
        verbose_name = _("Image")
        verbose_name_plural = _("Images")