from rest_framework import serializers
from apps.src.models import Tours, Lottery, TicketsLottery


class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tours
        fields = '__all__'


class LotterySerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()
    def get_file(self, obj):
        if obj.file:
            return obj.file.url.lstrip('')
        return None

    class Meta:
        model = Lottery
        fields = '__all__'


class TicketsLotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketsLottery
        fields = '__all__'
