import logging, requests
from django.conf import settings

from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.template.loader import render_to_string

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

import apps.site.models as model
import apps.site.serializers as serializer


logger = logging.getLogger(__name__)

class fetchInformation(generics.GenericAPIView):
    """
    Endpoint to retrieve Informations.
    Not Requires authentication.
    """
    serializer_class = serializer.InformationSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):

        try:
            queryset = model.Informations.objects.all().first()
            serializer = self.get_serializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'detail': 'NotFound Informations.'}, status=status.HTTP_404_NOT_FOUND)


class fetchFAQs(generics.ListAPIView):
    """
    Endpoint to retrieve details of the currently active FAQs.
    Requires no authentication.
    """
    serializer_class = serializer.FAQSerializer
    permission_classes = [AllowAny]

    pagination_class = PageNumberPagination
    page_size = 10

    def get_queryset(self):
        queryset = model.FAQs.objects.filter(is_active=True)
        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'Not Found FAQs.'}, status=status.HTTP_404_NOT_FOUND)

class fetchImagesSlider(generics.ListAPIView):
    """
    Endpoint to retrieve all images of Slider module.
    Not Requires authentication.
    """
    queryset = model.ImagenSlider.objects.all()
    serializer_class = serializer.ImagenSliderSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):

        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'detail': 'NotFound Images.'}, status=status.HTTP_404_NOT_FOUND)  


class fetchImagesGallery(generics.ListAPIView):
    """
    Endpoint to retrieve all images of Gallery module.
    Not Requires authentication.
    """
    queryset = model.ImagesGallery.objects.all()
    serializer_class = serializer.ImagesGallerySerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'detail': 'NotFound Gallery.'}, status=status.HTTP_404_NOT_FOUND)  

class reCaptchaVerify(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs): 
        try:
            payload = {'secret': settings.GGRECAPTCHA_KEY,'response': request.data.get('token')}
            response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)
            result = response.json()
            if result.get('success'):
                return JsonResponse({'success': True, 'message': 'Verification successful'})

        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return JsonResponse({'success': False, 'message': str(e)}, status=400)


class sendMessage(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        try:
            subject = request.data.get('subject')
            requestEmail = request.data.get('email', None),
            requestMessaje = request.data.get('message', None)
            email_template_name = 'message.html'

            c = {
                "send": requestEmail,
                "message": requestMessaje,
            }

            email = render_to_string(email_template_name, c)
            send_mail(subject, message=None, from_email='noreply@pajoytours.com',
                        recipient_list=['admin@pajoytours.com'], fail_silently=False, html_message=email)
            return Response({'detail': 'Email Enviado.'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'SendEmail Failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@csrf_exempt
def downloadPDF(request, id):
    obj = get_object_or_404(model.Informations, pk=id)        
    with open(obj.file.path, 'rb') as f:
        response = HttpResponse(f.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="PajoyTours.pdf"'
        return response
