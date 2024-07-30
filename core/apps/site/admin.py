from django.contrib import admin
from django.conf.locale.es import formats as es_formats
from django.contrib import messages

from apps.core.models import Accounts
import apps.site.models as model


class ImageSliderInline(admin.StackedInline):
    
    model = model.ImagenSlider
    extra = 0
    fieldsets = ((" ", {"fields": (("file",),)}),)

class ImageGalleryInline(admin.StackedInline):
    
    model = model.ImagesGallery
    extra = 0
    fieldsets = ((" ", {"fields": (("original","thumbnail"),)}),)

class FAQsInline(admin.StackedInline):
    
    model = model.FAQs
    extra = 0
    fieldsets = ((" ", {"fields": (("question","is_active"),"answer")}),)

class InformationAdmin(admin.ModelAdmin):

    inlines = [ImageSliderInline, ImageGalleryInline, FAQsInline, ]
    
    list_display = (
        "default",
        "email",
        "phone",
        "address",
        )

    fConfig = {"fields": (
        ("nit","phone","location"),
        ("email","address"),
        ("start_attention","end_attention","special_attention"),
        )}

    fTemplates = {"fields": (
        ("file","template_tour","template_lotteri"),
        )}

    fSocial = {"fields": (
        ("twitter","facebook","instagram"),
        )}

    fLegal = {"fields": (
        "terms",
        "legal",
        )}

    fTemplate = {"fields": (
        ("image1","image2"),
        )}

    fieldsets = (
        ("", fConfig),
        ("Templates", fTemplates),
        ("Social/Media", fSocial),
        ("Terms/Legal", fLegal),
        ("Template", fTemplate),
        )


    def has_delete_permission(self, request, obj=None):
        return False
    
    def has_add_permission(self, request):
        return False if model.Informations.objects.exists() else True

    readonly_fields=['default',]

