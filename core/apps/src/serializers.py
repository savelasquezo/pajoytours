from rest_framework import serializers
from apps.src.models import Lottery, TicketsLottery, HistoryLottery

class LotterySerializer(serializers.ModelSerializer):

    file = serializers.SerializerMethodField()

    class Meta:
        model = Lottery
        fields = '__all__'

class TicketsLotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketsLottery
        fields = '__all__'

class HistoryLotterySerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryLottery
        fields = '__all__'