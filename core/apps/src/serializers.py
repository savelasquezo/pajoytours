from rest_framework import serializers
import apps.src.models as model

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Invoices
        fields = '__all__'
