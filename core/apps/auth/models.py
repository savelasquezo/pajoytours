import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

def LogoUploadTo(instance, filename):
    return f"uploads/{instance.username}/logo/{filename}"

states = (('pending','pending'),('done','done'),('error','error'))
methods = (('crypto','crypto'),('bold','bold'))

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
    date_joined = models.DateField(_("Fecha"),default=timezone.now)
    last_joined = models.DateField(_("Ultimo Ingreso"),default=timezone.now)
    frame = models.CharField(_("Avatar"),default=0,max_length=2, null=True, blank=True)

    is_active = models.BooleanField(default=False, verbose_name="")
    is_staff = models.BooleanField(default=False, verbose_name="")

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone']

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email}"

    class Meta:
        indexes = [models.Index(fields=['email']),]
        verbose_name = _("Account")
        verbose_name_plural = _("Accounts")