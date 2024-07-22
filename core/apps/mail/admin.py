from django.contrib import admin
from django.conf.locale.es import formats as es_formats
from django.contrib import messages

import apps.mail.models as model


class MarketingAdmin(admin.ModelAdmin):
    
    list_display = (
        "uuid",
        "name",
        "emails",
        "last_update",
        "is_active"
        )

    fieldsets = (
        ("", {"fields": 
            (("name","emails","last_update","is_active"),
             ("file","status"))
            }
        ),
    )
    
    radio_fields = {'status': admin.HORIZONTAL}
    readonly_fields = ['last_update', 'emails', "is_active"]
    
    def has_change_permission(self, request, obj=None):
        if obj is not None and obj.status == "send":
            return False
        return super().has_change_permission(request, obj)

class EmailAdmin(admin.ModelAdmin):
    
    list_display = (
        "uuid",
        "email",
        "date_joined"
        )

    fieldsets = (
        ("", {"fields": 
            (("email","date_joined"),)
            }
        ),
    )

    readonly_fields=['email','date_joined']

    def has_add_permission(self, request, obj=None):
        return False