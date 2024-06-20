from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.conf.locale.es import formats as es_formats

from apps.core.models import Account, Invoice, ImagenSlider, Settings

class MyAdminSite(admin.AdminSite):
    index_title = 'Consola Administrativa'
    verbose_name = "Pajoytours"

    def get_app_list(self, request, app_label=None):
        """
        Return a sorted list of all the installed apps that have been
        registered in this site. NewMetod for ordering Models
        """
        ordering = {"Accounts": 1, "Invoices":2, "Tours": 3, "Lotterys": 4, "Settings": 5}
        app_dict = self._build_app_dict(request, app_label)

        app_list = sorted(app_dict.values(), key=lambda x: x["name"].lower())

        for app in app_list:
            app['models'].sort(key=lambda x: ordering[x['name']])

        return app_list

admin_site = MyAdminSite()
admin.site = admin_site
admin_site.site_header = "Pajoytours"

class InvoiceInline(admin.StackedInline):
    
    model = Invoice
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('method','state'),
            ('amount','date','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}
    readonly_fields = ('method','amount','date','voucher')

    def has_add_permission(self, request, obj=None):
        return False


class InvoiceAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'date',
        'state'
        )

    list_filter = ['date','state']
    search_fields = ['account','voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','method','state'),
            ('amount','date','voucher'),
        )}),
    )

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = []
        return fieldsets

    def has_add_permission(self, request):
         return False

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.state == "done":
            return [field.name for field in self.model._meta.fields]
        return ['account','method','amount','date','voucher']


class AccountAdmin(BaseUserAdmin):
    list_display = (
        'email',
        'phone'
    )


    search_fields = ('email','phone')

    ordering = ["email",]

    fieldsets = (
        (None, {'fields': (('email','is_active'), 'password')}),
            ('', {'fields': (
            ('phone','location'),
        )}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email','phone','password1', 'password2'),
        }),
    )

    list_filter=[]

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [InvoiceInline]
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        return ['email']


class ImagenSliderInline(admin.StackedInline):
    
    model = ImagenSlider
    extra = 0
    fieldsets = ((" ", {"fields": (("file",),)}),)

class SettingsAdmin(admin.ModelAdmin):

    inlines = [ImagenSliderInline]
    
    list_display = (
        "default",
        "email",
        "phone",
        "address",
        )

    fConfig = {"fields": (
        ("nit","phone"),
        ("email","address"),
        )}

    fSocial = {"fields": (
        "twitter",
        "facebook",
        "instagram",
        )}

    fieldsets = (
        ("", fConfig),
        ("Social/Media", fSocial),
        )

    def has_delete_permission(self, request, obj=None):
        return False
    
    def has_add_permission(self, request):
        return False if Settings.objects.exists() else True

    readonly_fields=['default',]



admin.site.register(Account, AccountAdmin)
admin.site.register(Invoice, InvoiceAdmin)
admin.site.register(Settings, SettingsAdmin)


