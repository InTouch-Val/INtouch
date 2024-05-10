from rest_framework import serializers


class SwaggerErrorHandlerSerializer(serializers.Serializer):
    message = serializers.CharField()
