from django.contrib.auth import login, logout
from django.contrib.auth.views import PasswordResetView
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.http import urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt
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
        return Response({
            'detail': 'Authorization successful',
            'user': user.pk
        })


class LogoutView(APIView):
    def get(self, request):
        logout(request)
        return Response({'detail': 'User logged out successfully'})


class UserConfirmEmailView(APIView):
    def get(self, request, pk, token):
        user = User.objects.get(pk=pk)
        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            login(request, user)
            return Response({'detail': 'Account activated successfully'})
        else:
            return Response({'detail': 'Account not activated'})


class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        url = reverse_lazy('password_reset_confirm', kwargs={'pk': user.pk, 'token': token})
        current_site = 'http://127.0.0.1:8000'
        html_message = render_to_string('registration/password_reset.html', {'url': url, 'domen': current_site})
        message = strip_tags(html_message)
        print(message)
        mail = EmailMultiAlternatives(
            'Сброс пароля',
            message,
            'postmaster@sandbox38de0f82b1c543aebbd984518bad4c17.mailgun.org',
            [email],
        )
        mail.attach_alternative(html_message, 'text/html')
        mail.send()
        return Response("Password reset email sent.")


class PasswordResetConfirmView(generics.GenericAPIView):
    def get(self, request, pk, token):
        user = User.objects.get(pk=pk)
        if user and default_token_generator.check_token(user, token):
            login(request, user)
            return Response({'detail': 'Password reset successfully'})
        else:
            return Response({'detail': 'Password not reset'})


class PasswordResetCompleteView(APIView):
    def post(self, request):
        user = request.user
        new_password = request.data.get('new_password')
        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'})
