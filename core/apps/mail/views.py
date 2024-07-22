import uuid, logging

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response

import apps.mail.models as model
import apps.mail.serializers as serializer

logger = logging.getLogger(__name__)


class AddEmailView(generics.GenericAPIView):

    serializer_class = serializer.EmailSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer_class = serializer.EmailSerializer(data=request.data)
            if serializer_class.is_valid():
                serializer_class.save()
                return Response(serializer_class.data, status=status.HTTP_201_CREATED)
            return Response(serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'Email no found.'}, status=status.HTTP_404_NOT_FOUND)
