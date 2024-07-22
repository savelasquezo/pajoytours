from django.urls import path, re_path
import apps.mail.views as view

urlpatterns = [
    path('add-email/', view.AddEmailView.as_view(), name='add-email'),
]

