from django.urls import path
import apps.src.views as view

urlpatterns = [
    path('fetch-invoices/', view.fetchInvoices.as_view(), name='fetch-invoices'),
    path('request-invoice/', view.requestInvoice.as_view(), name='request-invoice'),
    path('notify-invoice-bold/', view.notifyInvoiceBold.as_view(), name='notify-invoice-bold'),
]