from django.contrib import admin
from django.conf.locale.es import formats as es_formats
from django.contrib import messages

from apps.core.models import Accounts
import apps.manager.models as model


class AttendeesTourInline(admin.StackedInline):
    model = model.AttendeesTour
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('voucher','account','phone','state'),
            ('fullname','identification','birthdate'),
                )
            }
        ),
    )

    def get_readonly_fields(self, request, obj=None):
        return ['account','phone','state','voucher']

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class ToursAdmin(admin.ModelAdmin):

    list_display = (
        'uuid',
        'name',
        'location',
        'date',
        'price',
        'places',
        'type',
        'is_active',
    )

    search_fields = ['name','uuid']
    ordering = ['date',]

    fToursInfo = {'fields': (
        ('name','location'),
        ('places','price'),
        ('banner','type'),
        ('date','is_active',"map"),
        'description',
    )}

    
    fieldsets = (
        ('', fToursInfo),
    )

    list_filter = ['is_active']

    radio_fields = {'type': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [AttendeesTourInline]
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        return []


class TicketsLotteriInline(admin.StackedInline):
    model = model.TicketsLotteri
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('voucher','ticket','email','date'),
                )
            }
        ),
    )

    def get_readonly_fields(self, request, obj=None):
        return ['email','ticket','date','voucher']

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class ItemsScheduleInline(admin.StackedInline):
    model = model.ItemsSchedule
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('name','location','is_active'),
            ('banner','date'),
            ('description'),
                )
            }
        ),
    )

    def get_readonly_fields(self, request, obj=None):
        return ['uuid']



class ScheduleAdmin(admin.ModelAdmin):

    list_display = (
        'uuid',
        'name',
        'date',
        'is_active',
    )

    search_fields = ['name','uuid']
    ordering = ['date',]

    fScheduleInfo = {'fields': (
        ('name','date','is_active'),
    )}

    
    fieldsets = (
        ('', fScheduleInfo),
    )

    list_filter = ['is_active',]

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [ItemsScheduleInline]
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        return ['uuid']


class AdvertisementAdmin(admin.ModelAdmin):

    list_display = (
        'uuid',
        'name',
        'date',
        'is_active',
    )

    search_fields = ['name','uuid']
    ordering = ['date',]

    fScheduleInfo = {'fields': (
        ('uuid','name','is_active'),
        ('banner','date'),
        ('description'),
    )}

    
    fieldsets = (
        ('', fScheduleInfo),
    )

    list_filter = ['is_active',]

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        return ['uuid']


class LotteriAdmin(admin.ModelAdmin):

    inlines = [TicketsLotteriInline]
    
    list_display = (
        "lotteri",
        "prize",
        "sold",
        "amount",
        "price",
        "date",
        'is_active'
        )

    fieldsets = (
        ("Lotteri-Admin", {"fields": (
                    ("winner","is_active"),
                ),
            }
        ),
        ("Information", {"fields": 
            (("file","date","sold","amount"),
             ("prize","price","tickets"),
             "description")
            }
        ),
    )

    readonly_fields=['lotteri',]
    es_formats.DATETIME_FORMAT = "d M Y"
    
    def get_readonly_fields(self, request, obj=None):
        if obj and obj.id:
            return ["lotteri","prize","price","tickets","sold","amount","date"]
        return ["sold","amount"]

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [TicketsLotteriInline]
        if not obj:
            fieldsets = [fieldsets[1]]
            self.inlines = []
        return fieldsets

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        getWinner = model.TicketsLotteri.objects.filter(lotteri=obj,ticket=obj.winner, state=True)
        if getWinner.exists():
            email = Accounts.objects.get(email=getWinner.first().email).email
            messages.warning(request, f'¡Advertencia! ¡El Usuario {email} ha Ganado!')
        else:
            messages.success(request, f'¡El Sorteo no ha seleccionado ningun ganador!')



