from rest_framework import serializers
import apps.site.models as model

class ImagenSliderSerializer(serializers.ModelSerializer):
    
    file = serializers.SerializerMethodField()
    def get_file(self, obj):
        if obj.file:
            return obj.file.url.lstrip('')
        return None

    class Meta:
        model = model.ImagenSlider
        fields = '__all__'

class ImagesGallerySerializer(serializers.ModelSerializer):

    class Meta:
        model = model.ImagesGallery
        fields = ['original', 'thumbnail']

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.FAQs
        fields = '__all__'

class InformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Informations
        fields = '__all__'