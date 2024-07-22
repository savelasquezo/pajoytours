from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.conf.locale.es import formats as es_formats

from apps.src.admin import InvoiceInline
import apps.core.models as model

from apps.site.admin import InformationAdmin
from apps.site.models import Informations
from apps.site.admin import InformationAdmin
from apps.site.models import Informations
from apps.src.admin import InvoiceAdmin
from apps.src.models import Invoices
from apps.mail.admin import MarketingAdmin, EmailAdmin
from apps.mail.models import Marketing, Emails
from apps.manager.admin import ToursAdmin, LotteriAdmin, ScheduleAdmin, AdvertisementAdmin
from apps.manager.models import Tour, Lotteri, Schedule, Advertisement


class MyAdminSite(admin.AdminSite):
    index_title = 'Consola Administrativa'
    verbose_name = "Pajoytours"

    def get_app_list(self, request, app_label=None):
        """
        Return a sorted list of all the installed apps that have been
        registered in this site. NewMetod for ordering Models
        """
        ordering = {"Accounts": 1, "Invoices":2, "Tours": 3, "Lotteries": 4, "Schedules": 5, "Advertisements":6, "Marketing": 8, "Emails": 8, "Information": 9}
        app_dict = self._build_app_dict(request, app_label)

        app_list = sorted(app_dict.values(), key=lambda x: x["name"].lower())

        for app in app_list:
            app['models'].sort(key=lambda x: ordering[x['name']])

        return app_list

admin_site = MyAdminSite()
admin.site = admin_site
admin_site.site_header = "Pajoytours"


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
            ('phone','location','balance'),
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

admin.site.register(model.Accounts, AccountAdmin)
admin.site.register(Invoices, InvoiceAdmin)
admin.site.register(Tour, ToursAdmin)
admin.site.register(Lotteri, LotteriAdmin)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(Advertisement, AdvertisementAdmin)
admin.site.register(Marketing, MarketingAdmin)
admin.site.register(Emails, EmailAdmin)
admin.site.register(Informations, InformationAdmin)