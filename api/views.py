from django.contrib.auth import login, logout
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from rest_framework import generics, viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import authentication_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from main.models import *
from .serializers import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer


class MassageViewSet(viewsets.ModelViewSet):
    queryset = Massage.objects.all()
    serializer_class = MassageSerializer


class EmailLoginView(APIView):
    def post(self, request):
        serializer = EmailLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return Response({'detail': 'Успешная авторизация'})


def logout_user(request):
    logout(request)
    data = {'message': 'User logged out successfully'}
    return JsonResponse(data)