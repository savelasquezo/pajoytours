from djoser.serializers import PasswordResetConfirmSerializer
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from apps.core.models import Account
from apps.core.models import Settings, ImagenSlider

User = get_user_model()

class AccountSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = '__all__'

class CustomPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    def build_password_reset_confirm_url(self, uid, token):
        url = f"?forgot_password_confirm=True&uid={uid}&token={token}"
        return url

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = '__all__'

class ImagenSliderSerializer(serializers.ModelSerializer):
    
    file = serializers.SerializerMethodField()
    def get_file(self, obj):
        if obj.file:
            return obj.file.url.lstrip('')
        return None

    class Meta:
        model = ImagenSlider
        fields = '__all__'
