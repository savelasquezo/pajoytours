import os, uuid, logging, requests, json
from datetime import datetime
from django.db.models import Q
from django.conf import settings
from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from apps.core.functions import sendEmail

from apps.core.models import Accounts
from apps.mail.models import Emails
from apps.site.models import Informations

import apps.manager.models as model
import apps.manager.serializers as serializer


logger = logging.getLogger(__name__)

class fetchTours(generics.ListAPIView):

    permission_classes = [AllowAny]
    serializer_class = serializer.TourSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        name = self.request.query_params.get('name')
        price = self.request.query_params.get('price')
        date = self.request.query_params.get('date')

        tours_selected = self.request.query_params.get('tour')
        airway_selected = self.request.query_params.get('airway')
        excursions_selected = self.request.query_params.get('excursion')

        queryset = model.Tour.objects.filter(is_active=True)

        if name:
            queryset = queryset.filter(name__icontains=name)

        if price:
            queryset = queryset.filter(price__gt=price)

        if date:
            try:
                date = datetime.strptime(date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__gt=date)
            except Exception as e:
                logger.error("%s", e, exc_info=True)

        if tours_selected == 'true' or airway_selected == 'true' or excursions_selected == 'true':
            conditions = Q()
            if tours_selected == 'true':
                conditions |= Q(type='tour')
            if airway_selected == 'true':
                conditions |= Q(type='airway')
            if excursions_selected == 'true':
                conditions |= Q(type='excursion')
            queryset = queryset.filter(conditions)

        return queryset.order_by('id')

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Tours.'}, status=status.HTTP_404_NOT_FOUND)


class requestTour(generics.GenericAPIView):

    serializer_class = serializer.AdvertisementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, id):
        queryset = model.Tour.objects.get(id=id)
        return queryset

    def post(self, request, *args, **kwargs):
        try:
            tour = self.get_queryset(request.data.get("tour"))
            count = request.data.get("count")
            data = {field: request.data.get(field) for field in ['fullname', 'phone', 'identification', 'birthdate']}
            
            voucher = str(uuid.uuid4())[:8]
            data['voucher'] = voucher
            Emails.objects.get_or_create(email=request.data.get("email"))
            
            if tour.places < count:
                return Response({'error': 'The places has already been taken!'}, status=status.HTTP_400_BAD_REQUEST)

            total = count*tour.price
            if request.user.balance < total:
                return Response({'error': 'The balance are insufficient!'}, status=status.HTTP_400_BAD_REQUEST)

            if count > tour.places:
                return Response({'error': 'There are not enough places for this tour!'}, status=status.HTTP_400_BAD_REQUEST)

            tour.places -= count
            tour.save()

            request.user.balance -= total
            request.user.save()
            
            for _ in range(count):
                model.AttendeesTour.objects.create(tour=tour,account=request.user, **data)

            template_url = Informations.objects.first().template_tour
            email_list=[request.user.email]
            context_data = {
                'name': tour.name,
                'voucher': voucher
            }
            
            sendEmail(f'PjaoyTours - Tour-{context_data["name"]}', template_url, email_list, context_data)
            return Response({'success': 'OK', 'voucher': voucher}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Tour for Ticketing.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class fetchSchedule(generics.ListAPIView):
    """
    Endpoint to retrieve details of the currently active Schedules.
    Requires no authentication.
    """
    serializer_class = serializer.ScheduleSerializer
    permission_classes = [AllowAny]

    pagination_class = PageNumberPagination
    page_size = 10

    def get_queryset(self):
        queryset = model.Schedule.objects.filter(is_active=True)
        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'Not Found Schedule.'}, status=status.HTTP_404_NOT_FOUND)


class fetchAdvertisement(generics.ListAPIView):
    """
    Endpoint to retrieve details of the currently active Advertisements.
    Requires no authentication.
    """
    serializer_class = serializer.AdvertisementSerializer
    permission_classes = [AllowAny]

    pagination_class = PageNumberPagination
    page_size = 10

    def get_queryset(self):
        queryset = model.Advertisement.objects.filter(is_active=True)
        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'Not Found Advertisement.'}, status=status.HTTP_404_NOT_FOUND)


class fetchLotteries(generics.ListAPIView):
    """
    Endpoint to retrieve details of the currently active Lotteries.
    Requires no authentication.
    """
    serializer_class = serializer.LotteriSerializer
    permission_classes = [AllowAny]

    pagination_class = PageNumberPagination
    page_size = 10

    def get_queryset(self):
        queryset = model.Lotteri.objects.filter(is_active=True)
        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Schedule.'}, status=status.HTTP_404_NOT_FOUND)

class requestTicketLotteri(generics.GenericAPIView):
    """
    Endpoint to request and purchase a Lotteri ticket.
    Allows users to purchase a ticket for the current Lotteri by providing necessary information.
    """
    serializer_class = serializer.TicketsLotteriSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, obj):
        queryset = model.Lotteri.objects.get(id=obj)
        return queryset

    def post(self, request, *args, **kwargs):

        try:
            ticket = request.data.get('ticket')
            voucher = str(uuid.uuid4())[:8]
            data = {'email':request.user, 'ticket':ticket, 'voucher':voucher}
            lotteri = self.get_queryset(request.data.get('obj'))

            if model.TicketsLotteri.objects.filter(lotteri=lotteri,ticket=ticket).first() is not None:
                return Response({'error': 'The ticket has already been purchased!'}, status=status.HTTP_400_BAD_REQUEST)

            if request.user.balance < lotteri.price:
                return Response({'error': 'The balance/credits are insufficient!'}, status=status.HTTP_400_BAD_REQUEST)

            request.user.balance -= lotteri.price
            request.user.save()

            model.TicketsLotteri.objects.create(lotteri=lotteri,**data)
            
            template_url = Informations.objects.first().template_lotteri
            email_list=[request.user.email]
            context_data = {
                'name': lotteri.lotteri,
                'voucher': voucher
            }
            
            sendEmail(f'PjaoyTours - Loteria-{context_data["name"]}', template_url, email_list, context_data)
            return Response({'success': 'OK', 'voucher': voucher}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Lotteri.'}, status=status.HTTP_404_NOT_FOUND)


class fetchTicketsLotteri(generics.ListAPIView):
    """
    Endpoint to retrieve a list of lotteri tickets purchased by the authenticated user.
    Requires authentication.
    """
    serializer_class = serializer.TicketsLotteriSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = PageNumberPagination
    page_size = 10

    def get_queryset(self, lotteri):
        lotteri = model.Lotteri.objects.get(id=lotteri)
        return model.TicketsLotteri.objects.filter(email=self.request.user, lotteri=lotteri).order_by("-id")

    def list(self, request, *args, **kwargs):
        try:
            lotteri = self.kwargs.get('lotteri')
            queryset = self.get_queryset(lotteri)
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Schedule.'}, status=status.HTTP_404_NOT_FOUND)





