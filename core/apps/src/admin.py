from django.contrib import admin
from django.conf.locale.es import formats as es_formats
from django.contrib import messages

from apps.core.models import Account
from apps.src.models import Tours, Lottery, TicketsLottery


class ToursAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'name',
        'location',
        'date',
        'price',
        'type',
        'is_active',
    )

    search_fields = ['name']
    ordering = ['name',]

    fToursInfo = {'fields': (
        ('name','location','price'),
        ('banner','type','date','is_active'),
        'description',
    )}

    
    fieldsets = (
        ('', fToursInfo),
    )

    list_filter = ['is_active']

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        return []


class TicketsLotteryInline(admin.StackedInline):
    model = TicketsLottery
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('id','ticket','email'),
            ('date','voucher'),
                )
            }
        ),
    )

    def get_readonly_fields(self, request, obj=None):
        return ['id','email','ticket','date','voucher']

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

class LotteryAdmin(admin.ModelAdmin):

    inlines = [TicketsLotteryInline]
    
    list_display = (
        "lottery",
        "prize",
        "sold",
        "amount",
        "price",
        "date",
        'is_active'
        )

    fieldsets = (
        ("Lottery-Admin", {"fields": (
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

    readonly_fields=['lottery',]
    es_formats.DATETIME_FORMAT = "d M Y"
    
    def get_readonly_fields(self, request, obj=None):
        if obj and obj.id:
            return ["lottery","prize","price","tickets","sold","amount","date"]
        return ["sold","amount"]

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [TicketsLotteryInline]
        if not obj:
            fieldsets = [fieldsets[1]]
            self.inlines = []
        return fieldsets

    def save_model(self, request, obj, form, change):
        getWinner = TicketsLottery.objects.filter(lottery=obj,ticket=obj.winner, state=True)
        if getWinner.exists():
            email = Account.objects.get(email=getWinner.first().email).email
            messages.warning(request, f'¡Advertencia! ¡El Usuario {email} ha Ganado!')
        else:
            messages.success(request, f'¡El Sorteo no ha seleccionado ningun ganador!')

        super(LotteryAdmin, self).save_model(request, obj, form, change)


admin.site.register(Tours, ToursAdmin)
admin.site.register(Lottery, LotteryAdmin)
