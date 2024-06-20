from django.urls import path, re_path
import apps.src.views as view

urlpatterns = [
    path('fetch-tours', view.fetchTours.as_view(), name='fetch-tours'),
    path('fetch-lottery/', view.fetchLottery.as_view(), name='fetch-lottery'),
    path('fetch-all-lottery-tickets/', view.fetchAllTicketsLottery.as_view(), name='fetch-all-lottery-tickets'),
    path('request-ticketlottery/', view.requestTicketLottery.as_view(), name='request-ticketlottery'),
    re_path(r'fetch-lottery-tickets/(?P<lotteryID>\d+)', view.fetchTicketsLottery.as_view(), name='fetch-lottery-tickets'),
]

