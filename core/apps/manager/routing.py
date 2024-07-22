from django.urls import re_path
from apps.manager.consumers import AsyncLotteriConsumer

websocket_urlpatterns = [
    re_path(r"app/ws/tickets_lotteri/(?P<id>\w+)/$", AsyncLotteriConsumer.as_asgi()),
]

