from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.conf.locale.es import formats as es_formats

from apps.auth.models import Account

class AccountAdmin(BaseUserAdmin):
    list_display = ('email','phone')
    search_fields = ('email','phone')

    fieldsets = (
        (None, {'fields': (('email','is_active'), 'password')}),
            ('Información', {'fields': (
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
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        return ['email']


admin.site.register(Account, AccountAdmin)


