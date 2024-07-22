import uuid, hashlib, requests, logging
from django.conf import settings

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

import apps.src.models as model
import apps.src.serializers as serializer


logger = logging.getLogger(__name__)


BOLD_PUBLIC_KEY = settings.BOLD_PUBLIC_KEY
BOLD_SECRET_KEY = settings.BOLD_SECRET_KEY

class fetchInvoices(generics.ListAPIView):

    serializer_class = serializer.InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return model.Invoices.objects.filter(account=self.request.user).order_by("-id")

    def get(self, request, *args, **kwargs):
        
        try:
            queryset = self.get_queryset()
            serialized_data = self.serializer_class(queryset, many=True).data
            for item in serialized_data:
                item['type'] = "Invoice"
            return Response(serialized_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response([], status=status.HTTP_200_OK)


class requestInvoice(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):

        method = str(request.data.get('method', ''))
        amount = int(request.data.get('total', 0))

        data = {'method':method,'amount':amount}

        try:
            obj = model.Invoices.objects.create(account=request.user,state='pending',**data)
            integritySignature = "N/A"

            if method == "bold":
                apiInvoice = str(uuid.uuid4())[:12]
                hash256 = "{}{}{}{}".format(apiInvoice,str(amount),"COP",BOLD_SECRET_KEY)
                m = hashlib.sha256()
                m.update(hash256.encode())
                integritySignature = m.hexdigest()

            obj.voucher = apiInvoice
            obj.save()
            return Response({'apiInvoice': apiInvoice, 'integritySignature': integritySignature, 'amount': amount}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class notifyInvoiceBold(generics.GenericAPIView):

    serializer_class = serializer.InvoiceSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            payment_status = str(request.data.get('payment_status', ''))
            reference_id = str(request.data.get('reference_id', ''))

            invoice = model.Invoices.objects.get(voucher=reference_id)
            if invoice.method != "bold":
                return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_404_NOT_FOUND)

            if payment_status == "FAILED" or payment_status == "REJECTED":
                invoice.state = "error"
                invoice.save()

            if payment_status == "APPROVED":
                headers = {'Content-Type': 'application/json',
                            'Authorization': f'x-api-key {BOLD_PUBLIC_KEY}'}
                response = requests.get(f'https://payments.api.bold.co/v2/payment-voucher/{reference_id}', headers=headers)
                currentStatus = response.json().get('payment_status') if response.status_code == 200 else "pending"
                if currentStatus == "APPROVED":
                    invoice.state = "done"
                    invoice.save()

            return Response({'detail': 'Invoices state has been update!'}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_404_NOT_FOUND)



