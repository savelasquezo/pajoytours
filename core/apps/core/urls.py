from django.urls import path, re_path
import apps.core.views as view

urlpatterns = [
    path('status/', view.HTTPS, name='status'),
]

