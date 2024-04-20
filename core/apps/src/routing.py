from django.urls import re_path
from apps.src.consumers import AsyncLotteryConsumer

websocket_urlpatterns = [
    re_path(r"app/ws/lottery/", AsyncLotteryConsumer.as_asgi()),
]

