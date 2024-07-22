import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

@sync_to_async
def getAsyncLotteri(id):
    from apps.manager.models import Lotteri
    return Lotteri.objects.get(id=id)

@sync_to_async
def getAsyncTickets(lotteri):
    from apps.manager.models import TicketsLotteri
    return list(TicketsLotteri.objects.filter(lotteri=lotteri).values_list('ticket', flat=True))

@sync_to_async
def getAsyncsSerializersLotteri(lotteri):
    from.serializers import LotteriSerializer
    serializer = LotteriSerializer(lotteri)
    return serializer

async def getAsyncAviableTickets(id):
    lotteri = await getAsyncLotteri(id)
    getAviableTickets = [str(i).zfill(len(str(lotteri.tickets))) for i in range((lotteri.tickets+1))]
    getTickets = await getAsyncTickets(lotteri)
    tickets = [i for i in getAviableTickets if i not in getTickets]

    serializer = await getAsyncsSerializersLotteri(lotteri)

    return {'lotteri':serializer.data,'tickets': tickets}


class AsyncLotteriConsumer(AsyncWebsocketConsumer):

    async def asyncTicketsLotteri(self):
        data = await getAsyncAviableTickets(id=self.scope['url_route']['kwargs']['id'])
        return data

    async def connect(self):
        self.group_name = "groupTicketsLotteri"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        data = await self.asyncTicketsLotteri()
        await self.send(json.dumps(data))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        pass

    async def asyncSignal(self, event):
        data = event['data']
        await self.send(json.dumps(data))