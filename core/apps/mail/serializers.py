from rest_framework import serializers
import apps.mail.models as model

class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Emails
        fields = ['email']