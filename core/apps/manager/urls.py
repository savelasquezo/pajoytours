from django.urls import path, re_path
import apps.manager.views as view

urlpatterns = [
    path('fetch-tours', view.fetchTours.as_view(), name='fetch-tours'),
    path('request-tour/', view.requestTour.as_view(), name='request-tour'),
    path('fetch-lotteries/', view.fetchLotteries.as_view(), name='fetch-lotteries'),
    path('fetch-schedule', view.fetchSchedule.as_view(), name='fetch-schedule'),
    path('fetch-advertisement', view.fetchAdvertisement.as_view(), name='fetch-advertisement'),
    path('request-ticketlotteri/', view.requestTicketLotteri.as_view(), name='request-ticketlotteri'),
    re_path(r'fetch-lotteri-tickets/(?P<lotteri>\d+)', view.fetchTicketsLotteri.as_view(), name='fetch-lotteri-tickets'),
]

