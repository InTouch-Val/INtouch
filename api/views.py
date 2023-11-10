from django.urls import reverse_lazy
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from .models import *
from .serializers import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailsView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        token = self.kwargs['token']
        decoded_token = AccessToken(token)
        queryset = User.objects.filter(pk=int(decoded_token['user_id']))
        return queryset


class MassageViewSet(viewsets.ModelViewSet):
    queryset = Massage.objects.all()
    serializer_class = MassageSerializer


class UserConfirmEmailView(APIView):
    def get(self, request, pk, token):
        user = User.objects.get(pk=pk)
        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            refresh = RefreshToken.for_user(user)
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
        url = reverse_lazy(
            'password_reset_confirm',
            kwargs={'pk': user.pk, 'token': token}
        )
        current_site = 'http://127.0.0.1:8000'
        html_message = render_to_string(
            'registration/password_reset.html',
            {'url': url, 'domen': current_site}
        )
        message = strip_tags(html_message)
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
            return Response(status=302, headers={
                'Location': 'http://localhost:3000/set_new_password/'})
        else:
            return Response({'detail': 'Password not reset'})


class PasswordResetCompleteView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_password = serializer.validated_data['new_password']
        user = request.user
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'})


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


class AddAssignmentView(generics.CreateAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AddAssignmentSerializer


class ListAssignmentView(generics.ListAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer


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
