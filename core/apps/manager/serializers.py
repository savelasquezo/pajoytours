from rest_framework import serializers
import apps.manager.models as model


class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Tour
        fields = '__all__'

class AttendeesTourSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.AttendeesTour
        fields = '__all__'



class LotteriSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()
    def get_file(self, obj):
        if obj.file:
            return obj.file.url.lstrip('')
        return None

    class Meta:
        model = model.Lotteri
        fields = '__all__'


class TicketsLotteriSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.TicketsLotteri
        fields = '__all__'

class ItemsScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.ItemsSchedule
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    items = ItemsScheduleSerializer(many=True, source='itemsschedule_set', read_only=True)

    class Meta:
        model = model.Schedule
        fields = ['id', 'uuid', 'name', 'date', 'is_active', 'items']

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Advertisement
        fields = '__all__'