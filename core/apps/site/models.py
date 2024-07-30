import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _
from django_ckeditor_5.fields import CKEditor5Field
from django.core.exceptions import ValidationError

states = (('pending','Pending'),('done','Done'),('error','Error'))
methods = (('fiat','Fiat'),('bold','Bold'))

def TemplatesUploadTo(instance, id):
    return f"templates/mail/{id}"

def ImagesUploadTo(instance, id):
    return f"uploads/files/{id}"

def FilesUploadTo(instance, id):
    return f"uploads/items/{id}"

class Informations(models.Model):
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    default = models.CharField(_("Default"), max_length=32, unique=True, blank=True, null=True, default="PJ-Tours")

    nit = models.CharField(_("NIT"), max_length=64, blank=True, null=True)
    phone = models.CharField(_("Telefono"), max_length=64, blank=True, null=True)
    email = models.EmailField(_("Correo"), max_length=254, blank=True, null=True)
    address = models.CharField(_("Address"), max_length=64, blank=True, null=True)
    location = models.CharField(_("Localizacion"), max_length=64, blank=True, null=True)

    start_attention = models.TimeField(_("Inicial"), auto_now=False, auto_now_add=False, blank=False, null=False, default="09:00:00")
    end_attention = models.TimeField(_("Final"), auto_now=False, auto_now_add=False, blank=False, null=False, default="17:00:00")
    special_attention = models.TimeField(_("Festivos"), auto_now=False, auto_now_add=False, blank=False, null=False, default="15:00:00")

    twitter = models.URLField(_("Twitter"), max_length=128, blank=True, null=True)
    facebook = models.URLField(_("Facebook"), max_length=128, blank=True, null=True)
    instagram = models.URLField(_("Instagram"), max_length=128, blank=True, null=True)
    

    terms = CKEditor5Field(_("Terminos & Condiciones"), config_name='extends')
    legal = CKEditor5Field(_("Aviso-Legal"), config_name='extends')
    file = models.FileField(upload_to=FilesUploadTo, max_length=512, null=True, blank=True,
                            help_text="Archivo/Catalogo Empresarial")
    
    
    image1 = models.ImageField(_("Imagen"), upload_to=ImagesUploadTo, max_length=512, null=True, blank=True,
                              help_text="Width-(1200px) - Height-(900px)")

    image2 = models.ImageField(_("Imagen"), upload_to=ImagesUploadTo, max_length=512, null=True, blank=True,
                              help_text="Width-(1340px) - Height-(500px)")
    
    template_tour = models.FileField(upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for Tours")
    template_lotteri = models.FileField(upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for Lotteri")


    def __str__(self):
        return f"{self.default}"

    def clean(self):
        super().clean()
        if self.start_attention >= self.end_attention or self.start_attention >= self.special_attention:
            raise ValidationError("EL Intervalo de atencion es Invalido")

    class Meta:
        verbose_name = _("Information")
        verbose_name_plural = _("Information")


class ImagenSlider(models.Model):
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    settings = models.ForeignKey(Informations, on_delete=models.CASCADE)
    file = models.ImageField(_("Imagen"), upload_to=ImagesUploadTo, max_length=512, null=True, blank=True,
                              help_text="Width-(1340px) - Height-(500px)")

    def __str__(self):
        return f"{self.uuid}"

    class Meta:
        verbose_name = _("Image")
        verbose_name_plural = _("Images")

class ImagesGallery(models.Model):
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    settings = models.ForeignKey(Informations, on_delete=models.CASCADE)
    original = models.ImageField(_("Imagen"), upload_to=ImagesUploadTo, max_length=512, null=True, blank=True,
                              help_text="Width-(1024px) - Height-(614px)")
    
    thumbnail = models.ImageField(_("Miniatura"), upload_to=ImagesUploadTo, max_length=512, null=True, blank=True,
                              help_text="Width-(250px) - Height-(150px)")

    def __str__(self):
        return f"{self.uuid}"

    class Meta:
        verbose_name = _("Gallery")
        verbose_name_plural = _("Gallery")

class FAQs(models.Model):

    settings = models.ForeignKey(Informations, on_delete=models.CASCADE)
    question = models.CharField(_("Titulo"),max_length=64, null=False, blank=False)
    answer = models.TextField(_("Descripcion"),max_length=1024, null=False, blank=False)
    is_active = models.BooleanField(default=True, verbose_name='')

    def __str__(self):
        return f"{self.id}"

    class Meta:
        verbose_name = _("FAQ")
        verbose_name_plural = _("FAQs")