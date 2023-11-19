from django.urls import reverse_lazy
from rest_framework import generics, viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from .models import *
from .serializers import *


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (AllowAny, )
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailsView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        token = self.kwargs['token']
        decoded_token = AccessToken(token)
        queryset = User.objects.filter(pk=int(decoded_token['user_id']))
        return queryset


class UserConfirmEmailView(APIView):
    permission_classes = (AllowAny, )
    def get(self, request, pk, token):
        user = User.objects.get(pk=pk)
        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            refresh = RefreshToken.for_user(user)
            html_message = render_to_string('registration/welcome_mail.html')
            message = strip_tags(html_message)
            mail = EmailMultiAlternatives(
                'Welcome to INtouch!',
                message,
                'iw.sitnikoff@yandex.ru',
                [user.email],
            )
            mail.attach_alternative(html_message, 'text/html')
            mail.send()
            return Response({
                'detail': 'Account activated',
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh)
            })
        else:
            return Response({'detail': 'Account not activated'})


class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        url = f'/reset-password/{user.pk}/{token}/'
        current_site = 'http://127.0.0.1:3000'
        html_message = render_to_string(
            'registration/password_reset.html',
            {'url': url, 'domen': current_site, 'name': user.first_name}
        )
        message = strip_tags(html_message)
        mail = EmailMultiAlternatives(
            'Password Reset for INtouch Account',
            message,
            'iw.sitnikoff@yandex.ru',
            [email],
        )
        mail.attach_alternative(html_message, 'text/html')
        mail.send()
        return Response("Password reset email sent.")


class PasswordResetConfirmView(generics.GenericAPIView):
    def get(self, request, pk, token):
        user = User.objects.get(pk=pk)
        if user and default_token_generator.check_token(user, token):
            refresh = RefreshToken.for_user(user)
            return Response({
                'detail': 'Password reset successful',
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh)
            })
        else:
            return Response({'detail': 'Password not reset'})


class PasswordResetCompleteView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_password = serializer.validated_data['new_password']
        token = request.headers.get('Authorization').split(' ')[1]
        user = User.objects.get(pk=AccessToken(token)['user_id'])
        if user:
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password changed successfully'})
        else:
            return Response({'message': 'Password not changed'})


@api_view(['GET'])
def user_delete_hard(request):
    token = request.headers.get('Authorization').split(' ')[1]
    user = User.objects.get(pk=AccessToken(token)['user_id'])
    if user:
        user.delete()
        return Response({'message': 'User deleted successfully'})
    else:
        return Response({'message': 'User not found'})


@api_view(['GET'])
def user_delete_soft(request):
    token = request.headers.get('Authorization').split(' ')[1]
    user = User.objects.get(pk=AccessToken(token)['user_id'])
    if user:
        user.is_active = False
        user.save()
        return Response({'message': 'User deactivated successfully'})
    else:
        return Response({'message': 'User not found'})


class AddClientView(APIView):
    def post(self, request):
        serializer = AddClientSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        client = Client.objects.create(
            user=user,
            doctor_id=serializer.validated_data['doctor_id']
        )
        return Response("Confirm email sent.")


class ClientListView(generics.ListAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class AssignmentLikeView(APIView):
    def get(self, request, pk):
        assignment = Assignment.objects.get(pk=pk)
        assignment.like()
        assignment.save()
        return Response({'detail': 'Like.'})


class AssignmentDislikeView(APIView):
    def get(self, request, pk):
        assignment = Assignment.objects.get(pk=pk)
        assignment.dislike()
        assignment.save()
        return Response({'detail': 'Dislike.'})


class AssignmentAddUserMyListView(APIView):
    def get(self, request, pk, user_pk):
        assignment = Assignment.objects.get(pk=pk)
        user = User.objects.get(pk=user_pk)
        user.assignments.add(assignment)
        return Response({'detail': 'Assignment added successfully.'})


class AssignmentDeleteUserMyListView(APIView):
    def get(self, request, pk, user_pk):
        assignment = Assignment.objects.get(pk=pk)
        user = User.objects.get(pk=user_pk)
        user.assignments.remove(assignment)
        return Response({'detail': 'Assignment deleted successfully.'})


class AddAssignmentView(generics.CreateAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AddAssignmentSerializer


class ListAssignmentView(generics.ListAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
