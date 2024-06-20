from rest_framework import generics
from rest_framework.permissions import AllowAny

from rest_framework import status
from rest_framework.response import Response

from apps.core.models import ImagenSlider, Settings
from apps.core.serializers import SettingSerializer, ImagenSliderSerializer


class fetchInfo(generics.GenericAPIView):
    """
    Endpoint to retrieve settings.
    Not Requires authentication.
    """
    serializer_class = SettingSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            queryset = Settings.objects.get(default="Settings")
            serializer = self.get_serializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'detail': 'NotFound Settings.'}, status=status.HTTP_404_NOT_FOUND)

class fetchImagesSlider(generics.ListAPIView):
    """
    Endpoint to retrieve all images of Slider module.
    Not Requires authentication.
    """
    queryset = ImagenSlider.objects.all()
    serializer_class = ImagenSliderSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'detail': 'NotFound Images.'}, status=status.HTTP_404_NOT_FOUND)  
