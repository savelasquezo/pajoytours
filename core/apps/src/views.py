import os, uuid, logging
from datetime import datetime
from django.db.models import Q
from django.conf import settings
from django.utils import timezone


from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from apps.src.models import Tours, Lottery, TicketsLottery
from apps.src.serializers import TourSerializer, LotterySerializer, TicketsLotterySerializer

from apps.core.models import Account

class fetchTours(generics.ListAPIView):
    """
    Endpoint to retrieve list of the currently active Tours.
    Requires no authentication.
    """
    permission_classes = [AllowAny]
    serializer_class = TourSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        name = self.request.query_params.get('name')
        price = self.request.query_params.get('price')
        date = self.request.query_params.get('date')

        tours_selected = self.request.query_params.get('tours')
        airway_selected = self.request.query_params.get('airway')
        excursions_selected = self.request.query_params.get('excursions')

        queryset = Tours.objects.filter(is_active=True)

        if name:
            # Filtrar por name que contenga al menos una palabra igual a "name"
            queryset = queryset.filter(name__icontains=name)

        if price:
            # Filtrar por tours con precio menor o igual a "price"
            queryset = queryset.filter(price__lte=price)

        if date:
            # Filtrar por tours con date posterior a la date ingresada
            try:
                date = datetime.strptime(date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__gt=date)
            except ValueError:
                pass  # Manejo de error si la date ingresada no es válida

        # Filtrar por los botones seleccionados
        if tours_selected == 'true' or airway_selected == 'true' or excursions_selected == 'true':
            conditions = Q()
            if tours_selected == 'true':
                conditions |= Q(type='land')
            if airway_selected == 'true':
                conditions |= Q(type='airway')
            if excursions_selected == 'true':
                conditions |= Q(type='excursions')
            queryset = queryset.filter(conditions)

        return queryset.order_by('id')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



class fetchLottery(generics.ListAPIView):
    """
    Endpoint to retrieve details of the currently active Lotterys.
    Requires no authentication.
    """
    serializer_class = LotterySerializer
    permission_classes = [AllowAny]

    pagination_class = PageNumberPagination
    page_size = 10

    def get_queryset(self, request):
        queryset = Lottery.objects.filter(is_active=True)
        return queryset

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset(request)
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data, status=status.HTTP_200_OK)

        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchLottery {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)

class requestTicketLottery(generics.GenericAPIView):
    """
    Endpoint to request and purchase a Lottery ticket.
    Allows users to purchase a ticket for the current lottery by providing necessary information.
    """
    serializer_class = TicketsLotterySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        try:
            ticket = request.data.get('ticket')
            apiVoucher = str(uuid.uuid4())[:8]
            data = {'email':request.user, 'ticket':ticket, 'voucher':apiVoucher}

            lottery = Lottery.objects.get(id= request.data.get('lotteryID'))
            if TicketsLottery.objects.filter(lottery=lottery,ticket=ticket).first() is not None:
                return Response({'error': 'The ticket has already been purchased!'}, status=status.HTTP_400_BAD_REQUEST)
            
            if request.user.balance < lottery.price:
                return Response({'error': 'The balance/credits are insufficient!'}, status=status.HTTP_400_BAD_REQUEST)

            TicketsLottery.objects.create(lottery=lottery,**data) 
            return Response({'apiVoucher': apiVoucher}, status=status.HTTP_200_OK)

        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("requestTicketLottery {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)

class fetchTicketsLottery(generics.ListAPIView):
    """
    Endpoint to retrieve a list of Lottery tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = TicketsLotterySerializer
    permission_classes = [IsAuthenticated]

    pagination_class = PageNumberPagination
    page_size = 10

    def get_queryset(self, lottery):
        user = Account.objects.get(email=self.request.user.email)
        return TicketsLottery.objects.filter(email=user, lottery=lottery)

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset(self.kwargs.get('lottery'))
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data)

        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchTicketsLottery {} --> Error: {}\n".format(date, str(e)))
            return Response({'error': 'NotFound Lottery.'}, status=status.HTTP_404_NOT_FOUND)


class fetchAllTicketsLottery(generics.ListAPIView):
    """
    Endpoint to retrieve a list of lottery tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = TicketsLotterySerializer
    permission_classes = [IsAuthenticated]

    pagination_class = PageNumberPagination
    page_size = 10

    def get_queryset(self):
        return TicketsLottery.objects.filter(email=self.request.user).order_by("-id")

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data)
        
        except Exception as e:
            eDate = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("fetchAllTicketsLottery {} --> Error: {}\n".format(eDate, str(e)))
            return Response({'error': 'NotFound Any-Lottery.'}, status=status.HTTP_404_NOT_FOUND)


