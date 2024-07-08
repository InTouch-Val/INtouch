import random
import json
from datetime import datetime
from http import HTTPStatus

from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
    OpenApiExample,
    OpenApiResponse,
)
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.hashers import check_password
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_GET
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, viewsets, filters, mixins
from rest_framework.decorators import action, api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from api.models import *
from api.permissions import *
from api.serializers import *
from api.swagger_serializers import SwaggerMessageHandlerSerializer
from api.utils import (
    send_by_mail,
    avg_grade_annotation,
    get_therapists_metrics_query,
    get_clients_metrics_query,
    get_growth_metrics_query,
    form_metrics_file,
    form_dates_for_metrics,
)
from api.constants import (
    USER_TYPES,
    METRICS_FILES_NAMES,
    RANDOM_VALUE_SIZE,
    FIELD_DELETED,
    RANDOM_CHARSET_FOR_DELETING,
)
from api.tasks import reset_email_update_status


class CustomTokenObtainPairView(TokenObtainPairView):
    """Кастомное получение токенов с добавлением ограничения запросов."""

    throttle_classes = (AnonRateThrottle,)


@extend_schema_view(
    create=extend_schema(
        tags=["Users"],
        summary="User registration (doctor)",
        request=UserSerializer,
        responses={int(HTTPStatus.CREATED): UserSerializer},
    ),
    list=extend_schema(
        tags=["Users"],
        summary="Get list of users",
        responses={int(HTTPStatus.OK): UserSerializer},
    ),
    retrieve=extend_schema(
        tags=["Users"],
        summary="Get user by id",
        responses={int(HTTPStatus.OK): UserSerializer},
    ),
)
class UserViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
):
    """Создание и получение пользователей"""

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            permission_classes = [AllowAny]
        elif self.action == "retrieve":
            permission_classes = [DoctorRelClient]
        elif self.action == "list":
            permission_classes = [IsStaffOnly]
        else:
            permission_classes = self.permission_classes
        return [permission() for permission in permission_classes]


@extend_schema_view(
    get=extend_schema(tags=["Users"], summary="Get user as authorized / authenticated")
)
class UserDetailsView(generics.ListAPIView):
    """Получение модели пользователя по токену"""

    serializer_class = UserSerializer
    pagination_class = None

    def get_queryset(self):
        token = self.request.headers.get("Authorization").split(" ")[1]
        try:
            decoded_token = AccessToken(token)
        except TokenError:
            raise PermissionDenied("Invalid token")

        queryset = User.objects.filter(pk=int(decoded_token["user_id"]))
        return queryset


@extend_schema_view(
    get=extend_schema(
        tags=["Email", "Users"],
        summary="Confirm email reset",
    )
)
class UserConfirmEmailView(APIView):
    """Активация аккаунта, выдача токенов авторизации"""

    permission_classes = (AllowAny,)

    def get(self, request, pk, token):
        if self.request.user.is_anonymous:
            user = get_object_or_404(User, pk=pk)
        else:
            user = self.request.user
        if user.is_active:
            return Response({"message": "Account has already been activated"})
        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            refresh = RefreshToken.for_user(user)
            html_message = render_to_string("registration/welcome_mail.html")
            send_by_mail(html_message, user.email)
            return Response(
                {
                    "message": "Account activated",
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                }
            )
        else:
            return Response({"error": "Account not activated"})


@extend_schema_view(
    post=extend_schema(
        tags=["Password", "Users"],
        summary="Request password reset",
        request=PasswordResetSerializer,
    )
)
class PasswordResetRequestView(APIView):
    """Запрос на сброс пароля"""

    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response_data = serializer.save()
        return Response(response_data)


@extend_schema_view(
    get=extend_schema(
        tags=["Password", "Users"],
        summary="Confirm password reset",
    )
)
class PasswordResetConfirmView(generics.GenericAPIView):
    """Подтверждение сброса пароля, выдача токенов авторизации"""

    permission_classes = (AllowAny,)
    pagination_class = None

    def get(self, request, pk, token):
        user = User.objects.get(pk=pk)
        if user and default_token_generator.check_token(user, token):
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "message": "Password reset successful",
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                }
            )
        else:
            return Response({"error": "Password did not reset"})


@extend_schema_view(
    post=extend_schema(
        tags=["Password", "Users"],
        summary="Set the new password",
        request=ChangePasswordSerializer,
    )
)
class PasswordResetCompleteView(APIView):
    """Установка нового пароля пользователя"""

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        new_password = serializer.validated_data["new_password"]
        user = request.user
        if user:
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successfully"})
        else:
            return Response({"error": "Password not reset"})


@extend_schema_view(
    post=extend_schema(
        tags=["Password", "Users"],
        summary="Change password",
        request=UpdatePasswordSerializer,
    )
)
class UpdatePasswordView(APIView):
    """Изменение существующего пароля пользователя"""

    def post(self, request):
        serializer = UpdatePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        new_password = serializer.validated_data["new_password"]
        user = request.user
        if user and check_password(
            serializer.validated_data["password"], user.password
        ):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password changed successfully"})
        else:
            return Response({"error": "Password not changed"})


@extend_schema_view(
    post=extend_schema(
        tags=["Email", "Users"],
        summary="Change the email",
        request=UpdateEmailSerializer(),
    )
)
class UpdateEmailView(APIView):
    """Изменение почты пользователя."""

    def post(self, request):
        serializer = UpdateEmailSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["new_email"]
        user = request.user
        user.new_email_changing = True
        user.new_email_temp = email
        user.save()
        token = default_token_generator.make_token(user)
        url = f"/email-update/{user.pk}/{token}/"
        html_message = render_to_string(
            "registration/email_update.html",
            {"url": url, "domen": current_site, "name": user.first_name},
        )
        send_by_mail(html_message, email)
        reset_email_update_status.send_with_options(args=(user.pk,), delay=259200)
        return Response({"message": "Email update confirmation sent."})


@extend_schema_view(
    get=extend_schema(
        tags=["Email", "Users"],
        summary="Confierm email changing",
    )
)
class UpdateEmailConfirmView(generics.GenericAPIView):
    """Подтверждение изменения почты пользователя."""

    def get(self, request, pk, token):
        user = User.objects.get(pk=pk)
        if (
            user
            and default_token_generator.check_token(user, token)
            and user.new_email_changing
        ):
            user.username = user.new_email_temp
            user.email = user.new_email_temp
            user.new_email_temp = None
            user.new_email_changing = False
            user.save()
            return Response({"message": "Email updated successfully"})
        else:
            return Response({"error": "Email not updated: unvalid token"})


@extend_schema_view(
    patch=extend_schema(tags=["Users"], summary="Redact user's data"),
    put=extend_schema(tags=["Users"], summary="Redact user's data"),
)
class UpdateUserView(generics.UpdateAPIView):
    """Редактирование пользовательских данных"""

    permission_classes = (IsOwnerOnly,)
    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer


@extend_schema(
    tags=["Users"],
    summary="Delete user",
)
@api_view(["GET"])
def user_delete_hard(request):
    """Удаление конфиденциальных данных пользователя с сохранением самой сущности."""

    user = request.user
    if user:
        default_charset = RANDOM_CHARSET_FOR_DELETING
        user.first_name = FIELD_DELETED
        user.last_name = FIELD_DELETED
        user.email = FIELD_DELETED
        user.photo = None
        user.deleted = True
        user.is_active = False
        user.accept_policy = False
        user.deleted_on = timezone.now()
        user.username = "".join(
            random.choice(default_charset) for _ in range(RANDOM_VALUE_SIZE)
        )
        user.password = "".join(
            random.choice(default_charset) for _ in range(RANDOM_VALUE_SIZE)
        )

        if user.user_type == USER_TYPES[0]:
            Client.objects.filter(user=user).delete()
            for assignment in AssignmentClient.objects.filter(user=user):
                assignment.delete()
            for diary in DiaryNote.objects.filter(author=user):
                diary.delete()
        else:
            Doctor.objects.filter(user=user).delete()
            for assignment in Assignment.objects.filter(author=user, is_public=False):
                assignment.delete()
            for client in user.doctors.all():
                client.diagnosis = None
                client.about = None
                client.save()

        user.save()

        return Response({"message": "User deleted successfully"})
    else:
        return Response({"error": "User not found"})


@extend_schema(tags=["Users"], summary="Deactivate user")
@api_view(["GET"])
def user_delete_soft(request):
    """Перевод пользователя в неактивные"""

    user = request.user
    if user:
        user.is_active = False
        user.save()
        return Response({"message": "User deactivated successfully"})
    else:
        return Response({"error": "User not found"})


@extend_schema_view(
    delete=extend_schema(
        tags=["Clients"], summary="Delete user from doctor's interface"
    )
)
class ClientDeleteView(APIView):
    """Удаление аккаунта клиента из интерфейса доктора"""

    permission_classes = (IsDoctorOnly,)
    serializer_class = None

    def delete(self, request, pk):
        try:
            client = User.objects.get(pk=pk)
            request.user.doctor.clients.remove(client)
            return Response({"message": "Client deleted successfully"})
        except User.DoesNotExist:
            return Response({"error": "Client not found"})


@extend_schema_view(
    post=extend_schema(
        tags=["Clients"],
        summary="Add someone as a Client",
    )
)
class AddClientView(APIView):
    """Добавление нового клиента из интерфейса доктора"""

    permission_classes = (IsDoctorOnly,)

    def post(self, request):
        serializer = AddClientSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        client = serializer.save()
        user = request.user
        user.doctor.clients.add(client)
        return Response({"message": "Confirm email sent."})


@extend_schema_view(
    patch=extend_schema(
        tags=["Clients"],
        summary="Redact client's profile / final part of the registration",
    ),
    put=extend_schema(
        tags=["Clients"],
        summary="Redact client's profile / final part of the registration",
    ),
)
class UpdateClientView(generics.UpdateAPIView):
    """Завершение регистрации из интерфейса клиента, установка пароля"""

    queryset = User.objects.all()
    serializer_class = UpdateClientSerializer


@extend_schema_view(
    patch=extend_schema(tags=["Clients"], summary="Redact client's info"),
    put=extend_schema(tags=["Clients"], summary="Redact client's info"),
)
class DoctorUpdateClientView(generics.UpdateAPIView):
    """Редактирование доктором данных о клиенте"""

    permission_classes = (IsDoctorOnly,)
    queryset = User.objects.all()
    serializer_class = DoctorUpdateClientSerializer


@extend_schema_view(
    post=extend_schema(
        tags=["Assignments"],
        summary="Add assignment to favorites",
        request=None,
        responses={
            int(HTTPStatus.CREATED): OpenApiResponse(
                response=SwaggerMessageHandlerSerializer,
                examples=[
                    OpenApiExample(
                        "Successful addition request",
                        value={"message": "Assignment was added to favorites."},
                        status_codes=[int(HTTPStatus.CREATED)],
                        response_only=True,
                    )
                ],
            ),
        },
    )
)
class AssignmentAddUserMyListView(APIView):
    """Добавление задачи в избранное"""

    permission_classes = (IsDoctorOnly,)
    serializer_class = None

    def post(self, request, pk):
        user = request.user
        assignment = Assignment.objects.get(pk=pk)
        user.doctor.assignments.add(assignment)
        return Response(
            {"message": "Assignment was added to favorites."}, HTTPStatus.CREATED
        )


@extend_schema_view(
    delete=extend_schema(
        tags=["Assignments"],
        summary="Delete assignment from favorites",
        request=None,
        responses={
            int(HTTPStatus.NO_CONTENT): OpenApiResponse(
                response=SwaggerMessageHandlerSerializer,
                examples=[
                    OpenApiExample(
                        "Successful deletion request",
                        status_codes=[int(HTTPStatus.NO_CONTENT)],
                        value=None,
                        response_only=True,
                    )
                ],
            ),
        },
    )
)
class AssignmentDeleteUserMyListView(APIView):
    """Удаление задачи из избранного"""

    permission_classes = (IsDoctorOnly,)
    serializer_class = None

    def delete(self, request, pk):
        user = request.user
        assignment = Assignment.objects.get(pk=pk)
        user.doctor.assignments.remove(assignment)
        return Response(
            status=HTTPStatus.NO_CONTENT,
        )


@extend_schema_view(
    post=extend_schema(
        tags=["Assignments"],
        summary="Set assignment to a client",
        request=None,
        responses={
            int(HTTPStatus.CREATED): OpenApiResponse(
                response=SwaggerMessageHandlerSerializer,
                examples=[
                    OpenApiExample(
                        "Successful assignment set request",
                        value={
                            "message": "Assignment was set to the client successfully."
                        },
                        status_codes=[int(HTTPStatus.CREATED)],
                        response_only=True,
                    )
                ],
            ),
        },
        parameters=[
            OpenApiParameter(
                "clients",
                description=("Ids of clients to send assignment to. \n"),
                required=True,
            ),
        ],
    )
)
class AddAssignmentClientView(APIView):
    """Назначение задачи клиентам."""

    serializer_class = None

    def post(self, request, pk):
        try:
            clients = request.user.doctor.clients.filter(
                pk__in=request.query_params.get("clients").split(",")
            )
        except AttributeError:
            return Response(
                {"message": "You have to pass 'clients' query parameter."},
                HTTPStatus.BAD_REQUEST,
            )
        assignment = get_object_or_404(Assignment, pk=pk)
        for user in clients:
            assignments_copy = AssignmentClient.objects.create(
                title=assignment.title,
                text=assignment.text,
                author=assignment.author,
                assignment_type=assignment.assignment_type,
                tags=assignment.tags,
                language=assignment.language,
                share=assignment.share,
                likes=assignment.likes,
                image_url=assignment.image_url,
                user=user,
                assignment_root=assignment,
            )
            blocks = assignment.blocks.all()
            for block in blocks:
                block_copy = Block.objects.create(
                    question=block.question,
                    type=block.type,
                    image=block.image,
                    description=block.description,
                    reply=block.reply,
                    start_range=block.start_range,
                    end_range=block.end_range,
                    left_pole=block.left_pole,
                    right_pole=block.right_pole,
                )
                choice_replies = block.choice_replies.all()
                for choice_reply in choice_replies:
                    choice_reply_copy = BlockChoice.objects.create(
                        block=block_copy,
                        reply=choice_reply.reply,
                        checked=choice_reply.checked,
                    )
                    block_copy.choice_replies.add(choice_reply_copy)
                assignments_copy.blocks.add(block_copy)
            user.client.assignments.add(assignments_copy)
            assignment.share += 1
        assignment.save()
        return Response(
            {"message": "Assignment was set to the clients successfully."},
            HTTPStatus.CREATED,
        )


@extend_schema_view(
    create=extend_schema(
        tags=["Assignments"],
        summary="Create assignment",
        request=AssignmentSerializer,
        examples=[
            OpenApiExample(
                "Example input",
                description=(
                    "POST request for Assignment model, all fields are indicated. \n"
                    "Chossing for fields like languages / assignment_type "
                    "you can view at 'Get list of assignments' route."
                ),
                value={
                    "title": "Test Assignment",
                    "text": "Some test text",
                    "assignment_type": "quiz",
                    "tags": "SomeTagLOL",
                    "language": "en",
                    "image_url": "Ask_Frontend_Developers_What_URL_To_Use",
                    "blocks": [
                        {
                            "question": "What's the point of doing examples?",
                            "image": (
                                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk"
                                "+A8AAQUBAScY42YAAAAASUVORK5CYII="
                            ),
                            "choice_replies": [
                                {"reply": "one", "checked": False},
                                {"reply": "two", "checked": False},
                            ],
                            "type": "image",
                        }
                    ],
                    "left_pole": "1",
                    "right_pole": "10",
                    "type": "multiple",
                    "start_range": 1,
                    "end_range": 10,
                },
                request_only=True,
                response_only=False,
            ),
        ],
    ),
    list=extend_schema(
        tags=["Assignments"],
        summary="Get list of assignments",
        request=None,
        parameters=[
            OpenApiParameter(
                "ordering",
                description=(
                    "Which field to use when ordering the results. \n"
                    "- `-average_grade / average_grade` \n"
                    "- `-share / share` \n"
                    "- `-add_date / add_date` \n \n "
                    "example: `-add_date,-average_grade,-share`"
                ),
            ),
            OpenApiParameter(
                "favorites",
                description=("To return favorites of a doctor."),
                enum=[
                    "true",
                ],
            ),
        ],
    ),
    retrieve=extend_schema(
        tags=["Assignments"],
        summary="Get assignment by id",
        request=None,
    ),
    update=extend_schema(
        tags=["Assignments"],
        summary="Update assignment",
        request=AssignmentSerializer,
    ),
    partial_update=extend_schema(
        tags=["Assignments"],
        summary="Update assignment",
        request=AssignmentSerializer,
    ),
    destroy=extend_schema(
        tags=["Assignments"],
        summary="Delete assignment",
        request=None,
    ),
    draft=extend_schema(
        tags=["Assignments"],
        summary="Move assignment to draft",
        request=None,
        responses={
            int(HTTPStatus.OK): OpenApiResponse(
                response=SwaggerMessageHandlerSerializer,
                examples=[
                    OpenApiExample(
                        "Successful draft request",
                        value={"message": "Assignment was saved in draft."},
                        status_codes=[int(HTTPStatus.OK)],
                        response_only=True,
                    )
                ],
            ),
        },
    ),
)
class AssignmentViewSet(viewsets.ModelViewSet):
    """CRUD операции над задачами доктора"""

    permission_classes = (AssignmentDoctorOnly,)
    queryset = Assignment.objects.filter(is_public=True)
    serializer_class = AssignmentSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    filterset_fields = [
        "assignment_type",
        "language",
        "author",
    ]
    ordering_fields = [
        "average_grade",
        "add_date",
        "share",
    ]
    ordering = ["-add_date"]
    search_fields = [
        "title",
    ]

    def get_queryset(self):
        favorites = self.request.query_params.get("favorites") == "true"
        if favorites:
            return avg_grade_annotation(self.request.user.doctor.assignments)
        return avg_grade_annotation(
            (
                super().get_queryset()
                | Assignment.objects.filter(author=self.request.user, is_public=False)
            )
        )

    def destroy(self, request, *args, **kwargs):
        assignment = self.get_object()
        if assignment.author != request.user:
            raise PermissionDenied(
                "You don't have permission to delete this assignment."
            )
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        assignment = self.get_object()
        if assignment.author != request.user:
            raise PermissionDenied(
                "You don't have permission to update this assignment."
            )
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=["PATCH"])
    def draft(self, request, pk):
        """Сокрытие задачи из общего пула, добавление  драфт"""
        assignments = self.get_object()
        assignments.is_public = False
        assignments.save()
        return Response({"message": "Assignment was saved in draft."}, HTTPStatus.OK)


@extend_schema_view(
    list=extend_schema(
        tags=["Client's Assignments"],
        summary="List of client's assignments",
        request=None,
    ),
    retrieve=extend_schema(
        tags=["Client's Assignments"],
        summary="Get client's assignment by id",
        request=None,
    ),
    update=extend_schema(
        tags=["Client's Assignments"],
        summary="Update client's assignment",
        request=AssignmentClientSerializer,
    ),
    partial_update=extend_schema(
        tags=["Client's Assignments"],
        summary="Update client's assignment",
        request=AssignmentClientSerializer,
    ),
    destroy=extend_schema(
        tags=["Client's Assignments"],
        summary="Delete client's assignment",
        request=None,
    ),
    complete=extend_schema(
        tags=["Client's Assignments"],
        summary="Complete client's assignment",
        request=None,
        responses={
            int(HTTPStatus.OK): OpenApiResponse(
                response=SwaggerMessageHandlerSerializer,
                examples=[
                    OpenApiExample(
                        "Successful request for completion",
                        value={"message": "Status is 'done'."},
                        status_codes=[int(HTTPStatus.OK)],
                        response_only=True,
                    )
                ],
            ),
        },
    ),
    clear=extend_schema(
        tags=["Client's Assignments"],
        summary="Clear answers in client's assignment",
        request=None,
        responses={
            int(HTTPStatus.OK): OpenApiResponse(
                response=SwaggerMessageHandlerSerializer,
                examples=[
                    OpenApiExample(
                        "Successful clearing request",
                        value={"message": "Assignments cleared successfully."},
                        status_codes=[int(HTTPStatus.OK)],
                        response_only=True,
                    ),
                ],
            ),
            int(HTTPStatus.BAD_REQUEST): OpenApiResponse(
                response=SwaggerMessageHandlerSerializer,
                examples=[
                    OpenApiExample(
                        "Bad request for clearing",
                        value={"message": "No cleaning required. Status is 'to do'."},
                        status_codes=[int(HTTPStatus.BAD_REQUEST)],
                        response_only=True,
                    ),
                ],
            ),
        },
    ),
    visible=extend_schema(
        tags=["Client's Assignments"],
        summary="Change visibility of a client's assignment",
        request=None,
        responses={
            int(HTTPStatus.OK): OpenApiResponse(
                response=SwaggerMessageHandlerSerializer,
                examples=[
                    OpenApiExample(
                        "Successful visible request",
                        value={"message": "Visibility changed to true / false."},
                        status_codes=[int(HTTPStatus.OK)],
                        response_only=True,
                    )
                ],
            ),
        },
    ),
)
class AssignmentClientViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    """CRUD операции над задачами клиента"""

    # TODO: ограничить выдачу по связке доктор-задания его клиентов
    queryset = AssignmentClient.objects.all()
    serializer_class = AssignmentClientSerializer
    filterset_fields = [
        "user",
    ]
    permission_classes = (AssignmentAuthorOnly,)

    def get_queryset(self):
        user = self.request.user
        if user.user_type == USER_TYPES[0]:
            return user.client.assignments
        query = AssignmentClient.objects.none()
        for client_user in user.doctor.clients.all():
            query = query | client_user.client.assignments.all().filter()
        return query

    @action(detail=True, methods=["get"])
    def complete(self, request, pk):
        """Смена статуса задачи на 'done'"""
        assignment = self.get_object()
        assignment.status = "done"
        assignment.save()
        return Response({"message": "Status is 'done'."}, HTTPStatus.OK)

    @action(detail=True, methods=["get"])
    def clear(self, request, pk):
        """Очистка ответов в задании клиента"""
        assignment = self.get_object()

        if assignment.status == "to do":
            return Response(
                {"message": "No cleaning required. Status is 'to do'."},
                HTTPStatus.BAD_REQUEST,
            )

        for block in assignment.blocks:
            if block.type == "text":
                block.reply = ""
            if block.type == "single" or block.type == "multiple":
                for ans in block.choice_replies:
                    ans.checked = False
                block.choice_replies.save()
            if block.type == "range":
                pass
            if block.type == "image":
                pass
            block.save()

        assignment.status = "to do"
        assignment.save()
        return Response({"message": "Assignments cleared successfully."}, HTTPStatus.OK)

    @action(detail=True, methods=["POST"])
    def visible(self, request, pk):
        """Смена значения видимости задания для доктора"""
        assignment = self.get_object()
        assignment.visible = not assignment.visible
        assignment.save()
        return Response(
            {"message": f"Visibility changed to {assignment.visible}"}, HTTPStatus.OK
        )


# TODO : To be added, not implemented in V1
class NoteViewSet(viewsets.ModelViewSet):
    """CRUD операции над заметками"""

    queryset = Note.objects.all()
    serializer_class = NoteSerializer


@extend_schema_view(
    list=extend_schema(tags=["Diaries"], summary="Get diary notes"),
    retrieve=extend_schema(tags=["Diaries"], summary="Get diary note by id"),
    create=extend_schema(
        tags=["Diaries"],
        summary="Create diary note",
        description="To create a diary note you have to pass text in one of the arguments below.",
        request=DiaryNoteSerializer,
        examples=[
            OpenApiExample(
                "Succesful creation request",
                description=(
                    "In the primary emotion choices are: \n"
                    " - TERRIBLE \n - GOOD \n - OKAY \n - BAD \n - GREAT \n \n"
                    "In the clarifying emotions choices are equal to Frontend. "
                    "So check them out there, because there is **A LOT** to cover."
                ),
                value={
                    "event_details": "your_text",
                    "event_details_tags": "some_text_tags",
                    "thoughts_analysis": "your_text",
                    "thoughts_analysis_tags": "some_text_tags",
                    "emotion_type": "your_text",
                    "emotion_type_tags": "some_text_tags",
                    "physical_sensations": "your_text",
                    "physical_sensations_tags": "some_text_tags",
                    "primary_emotion": "TERRIBLE",
                    "clarifying_emotion": [
                        "Loss",
                        "Anxiety",
                        "Anger",
                    ],
                },
                request_only=True,
            ),
        ],
        responses={
            int(HTTPStatus.OK): OpenApiResponse(response=DiaryNoteSerializer),
            int(HTTPStatus.BAD_REQUEST): OpenApiResponse(
                response=SwaggerMessageHandlerSerializer,
                examples=[
                    OpenApiExample(
                        "When you pass emotion only",
                        value={
                            "message": "You can not create a diary note without text fields!"
                        },
                        response_only=True,
                    ),
                    OpenApiExample(
                        "When you pass nothing",
                        value={"message": "You can not create an empty diary note!"},
                        response_only=True,
                    ),
                ],
            ),
        },
    ),
    destroy=extend_schema(
        tags=["Diaries"], summary="Delete diary note", responses=None, request=None
    ),
    update=extend_schema(
        tags=["Diaries"],
        summary="Update diary note",
        description="Deletes values of non passed fields.",
    ),
    partial_update=extend_schema(tags=["Diaries"], summary="Update diary note"),
    visible=extend_schema(
        tags=["Diaries"],
        summary="Change diary note visibility",
        request=None,
        responses={
            int(HTTPStatus.OK): OpenApiResponse(
                response=SwaggerMessageHandlerSerializer,
                examples=[
                    OpenApiExample(
                        "Good request",
                        value={"message": "Visibility changed to true / false"},
                    ),
                ],
            )
        },
    ),
)
class DiaryNoteViewSet(viewsets.ModelViewSet):
    """CRUD операции над заметками в дневнике"""

    queryset = DiaryNote.objects.all()
    serializer_class = DiaryNoteSerializer
    filterset_fields = [
        "author",
    ]
    permission_classes = (DiaryAuthorOnly,)

    def get_queryset(self):
        user = self.request.user
        if user.user_type == USER_TYPES[0]:
            return user.diary_notes
        query = DiaryNote.objects.none()
        for client_user in user.doctor.clients.all():
            query = query | client_user.diary_notes.all().filter(visible=True)
        return query

    @action(detail=True, methods=["POST"])
    def visible(self, request, pk):
        """Смена значения видимости записи в дневнике для доктора"""
        diary_note = self.get_object()
        diary_note.visible = not diary_note.visible
        diary_note.save()
        return Response(
            {"message": f"Visibility changed to {diary_note.visible}"}, HTTPStatus.OK
        )


@require_GET
def assetlink(request):
    """Вью-функция для деплоя файла конфигурации мобильного предложения."""
    path = f"{settings.STATIC_ROOT}/assetlinks.json"
    with open(path, "r") as f:
        data = json.loads(f.read())
    response = JsonResponse(data, safe=False)
    return response


@extend_schema_view(
    therapists=extend_schema(
        tags=["Metrics"],
        summary="Therapists metrics",
        request=None,
        responses={
            int(HTTPStatus.OK): OpenApiResponse(
                response=TherapistsMetricsSerializer,
            )
        },
        parameters=[
            OpenApiParameter(
                "date_from",
                description=(
                    "Filter accounts from date \n" "Date format: 01-01-2000 \n"
                ),
                required=True,
            ),
            OpenApiParameter(
                "date_to",
                description=("Filter accounts to date \n" "Date format: 01-01-2000 \n"),
                required=True,
            ),
        ],
    ),
    clients=extend_schema(
        tags=["Metrics"],
        summary="Clients metrics",
        request=None,
        responses={
            int(HTTPStatus.OK): OpenApiResponse(
                response=ClientsMetricsSerializer,
            )
        },
        parameters=[
            OpenApiParameter(
                "date_from",
                description=(
                    "Filter accounts from date. \n" "Date format: 01-01-2000 \n"
                ),
                required=True,
            ),
            OpenApiParameter(
                "date_to",
                description=("Filter accounts to date \n" "Date format: 01-01-2000 \n"),
                required=True,
            ),
        ],
    ),
    growth=extend_schema(
        tags=["Metrics"],
        summary="Growth metrics",
        request=None,
        responses={
            int(HTTPStatus.OK): OpenApiResponse(
                response=ClientsMetricsSerializer,
            )
        },
        parameters=[
            OpenApiParameter(
                "date_from",
                description=(
                    "Filter accounts from date. \n" "Date format: 01-01-2000 \n"
                ),
                required=True,
            ),
            OpenApiParameter(
                "date_to",
                description=("Filter accounts to date \n" "Date format: 01-01-2000 \n"),
                required=True,
            ),
        ],
    ),
)
class ProjectMetricsViewSet(
    viewsets.GenericViewSet,
):
    serializer_class = None

    def get_queryset(self, for_whom, date_from, date_to):
        queries = {
            "therapists": get_therapists_metrics_query,
            "clients": get_clients_metrics_query,
            "growth": get_growth_metrics_query,
        }
        return queries[for_whom](date_from, date_to)

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        return serializer_class(*args, **kwargs)

    def form_serialized_metrics_data(self, request):
        for_whom = request.path.split("/")[4]
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        formatted_dates = form_dates_for_metrics(date_from, date_to)
        if isinstance(formatted_dates, Response):
            return formatted_dates
        query = self.get_queryset(for_whom, formatted_dates[0], formatted_dates[1])
        try:
            return Response(
                data=self.get_serializer(query, many=True).data, status=HTTPStatus.OK
            )
        except AttributeError:
            serialized_data = self.get_serializer(data=query)
            serialized_data.is_valid(raise_exception=True)
            return Response(data=serialized_data.data, status=HTTPStatus.OK)

    @action(
        methods=["GET"],
        detail=False,
        url_name="project_metrics_therapists",
        serializer_class=TherapistsMetricsSerializer,
    )
    def therapists(self, request):
        return self.form_serialized_metrics_data(request)

    @action(
        methods=["GET"],
        detail=False,
        url_name="project_metrics_clients",
        serializer_class=ClientsMetricsSerializer,
    )
    def clients(self, request):
        return self.form_serialized_metrics_data(request)

    @action(
        methods=["GET"],
        detail=False,
        url_name="project_metrics_clients",
        serializer_class=GrowthMetricsSerializer,
    )
    def growth(self, request):
        return self.form_serialized_metrics_data(request)


def metrics_download(request, for_whom: str):
    """Sends the project metrics files, depends on for_whom query parameter."""
    response = HttpResponse(
        content_type="text/csv",
        headers={
            "Content-Disposition": 'attachment; filename="{0}"'.format(
                METRICS_FILES_NAMES[for_whom]
            )
        },
    )
    date_from = request.GET.get("date_from")
    date_to = request.GET.get("date_to")
    if not date_from or not date_to:
        return JsonResponse(
            data={"error": "You have to pass both date_from and date_to parameters."},
            status=HTTPStatus.BAD_REQUEST,
        )
    try:
        formatted_date_from = timezone.make_aware(
            datetime.strptime(date_from, "%d-%m-%Y"),
        )
        formatted_date_to = timezone.make_aware(
            datetime.strptime(date_to, "%d-%m-%Y"),
        )
    except ValueError:
        return JsonResponse(
            data={"error": "Incorrect date format. Correct format 01-01-1999."},
            status=HTTPStatus.BAD_REQUEST,
        )
    form_metrics_file(response, for_whom, formatted_date_from, formatted_date_to)
    return response
