from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.conf.locale.es import formats as es_formats

import apps.src.models as model

class InvoiceInline(admin.StackedInline):
    
    model = model.Invoices
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
        "uuid",
        'account',
        'amount',
        'voucher',
        'date',
        'state'
        )

    list_filter = ['date','state']
    search_fields = ['account','voucher','uuid']

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
        return ['uuid','account','method','amount','date','voucher']






