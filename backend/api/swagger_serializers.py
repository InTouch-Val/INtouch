from rest_framework import serializers


class SwaggerMessageHandlerSerializer(serializers.Serializer):
    message = serializers.CharField()
