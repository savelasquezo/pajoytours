from django.urls import path
import apps.site.views as view

urlpatterns = [
    path('fetch-sliders/', view.fetchImagesSlider.as_view(), name='fetch-sliders'),
    path('fetch-gallery/', view.fetchImagesGallery.as_view(), name='fetch-gallery'),
    path('fetch-faqs/', view.fetchFAQs.as_view(), name='fetch-faqs'),
    path('fetch-information/', view.fetchInformation.as_view(), name='fetch-information'),
    path('files/<int:id>/download/', view.downloadPDF, name='download-file'),
    path('recaptcha-verify/', view.reCaptchaVerify.as_view(), name='recaptcha-verify'),
    path('send-message/', view.sendMessage.as_view(), name='send-message'),
]