import json
from http import HTTPStatus

from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
    OpenApiExample,
)
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, viewsets, filters, mixins
from rest_framework.decorators import action, api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from api.models import *
from api.permissions import *
from api.serializers import *
from api.utils import send_by_mail, avg_grade_annotation
from api.constants import USER_TYPES
from api.tasks import reset_email_update_status


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
        elif self.action == 'retrieve':
            permission_classes = [DoctorRelClient]
        elif self.action == 'list':
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
    """Полное удаление пользователя"""
    user = request.user
    if user:
        user.delete()
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
        serializer = AddClientSerializer(data=request.data, context={"request": request})
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
    get=extend_schema(
        tags=["Assignments"],
        summary="Add assignment to favourites",
    )
)
class AssignmentAddUserMyListView(APIView):
    """Добавление задачи в свой список"""

    permission_classes = (IsDoctorOnly,)
    serializer_class = None

    def get(self, request, pk):
        user = request.user
        assignment = Assignment.objects.get(pk=pk)
        user.doctor.assignments.add(assignment)
        return Response({"message": "Assignment added successfully."})


@extend_schema_view(
    get=extend_schema(tags=["Assignments"], summary="Delete assignment from favourites")
)
class AssignmentDeleteUserMyListView(APIView):
    """Удаление задачи из своего списка"""

    permission_classes = (IsDoctorOnly,)
    serializer_class = None

    def get(self, request, pk):
        user = request.user
        assignment = Assignment.objects.get(pk=pk)
        user.doctor.assignments.remove(assignment)
        return Response({"message": "Assignment deleted successfully."})


@extend_schema_view(
    get=extend_schema(
        tags=["Assignments"],
        summary="Set assignment to a client",
    )
)
class AddAssignmentClientView(APIView):
    """Назначение задачи клиенту"""

    serializer_class = None

    def get(self, request, pk, client_pk):
        assignment = get_object_or_404(Assignment, pk=pk)
        client = get_object_or_404(User, pk=client_pk)
        if not request.user.doctor.clients.filter(id=client_pk).exists():
            return Response(
                {"message": "You cannot add assignment to not-yours client."}
            )
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
            user=client,
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
        client.client.assignments.add(assignments_copy)
        assignment.share += 1
        assignment.save()
        return Response({"message": "Assignment set client successfully."})


@extend_schema_view(
    create=extend_schema(
        tags=["Assignments"],
        summary="Create assignment",
        request=AssignmentSerializer,
        examples=[
            OpenApiExample(
                "Example input",
                description="Creation of an alias",
                value={
                    "title": "Test Assignment",
                    "text": "Some test text",
                    "assignment_type": "quiz",
                    "tags": "SomeTagLOL",
                    "language": "en",
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
        responses={},
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
                    "- `-avarage_grade / avarage_grade` \n"
                    "- `-share / share` \n"
                    "- `-add_date / add_date` \n"
                ),
                enum=[
                    "-avarage_grade",
                    "avarage_grade",
                    "-share",
                    "share",
                    "-add_date",
                    "add_date",
                ],
            )
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
    ),
)
class AssignmentViewSet(viewsets.ModelViewSet):
    """CRUD операции над задачами доктора"""

    # TODO: ограничить выдачу по связке доктор-задания его клиентов
    permission_classes = (AssignmentDiaryDoctorOnly,)
    queryset = Assignment.objects.all()
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
        "avarage_grade",
        "add_date",
        "share",
    ]
    search_fields = [
        "title",
    ]

    def get_queryset(self):
        favourites = self.request.query_params.get("favourites") == "true"
        if favourites:
            return avg_grade_annotation(self.request.user.doctor.assignments)
        return avg_grade_annotation(super().get_queryset())

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

    @action(detail=True, methods=["get"])
    def draft(self, request, pk):
        """Сокрытие задачи из общего пула, добавление  драфт"""
        assignments = self.get_object()
        assignments.is_public = False
        assignments.save()
        return Response({"message": "Assignments saved in draft"})


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
    clear=extend_schema(
        tags=["Client's Assignments"],
        summary="Clear answers in client's assignment",
        request=None,
    ),
    complete=extend_schema(
        tags=["Client's Assignments"],
        summary="Complete client's assignment",
        request=None,
        responses={int(HTTPStatus.OK): {"message": "Status is 'done'"}},
    ),
    visible=extend_schema(
        tags=["Client's Assignments"],
        summary="Change visibility of a client's assignment",
        request=None,
        responses={int(HTTPStatus.OK): {"message": "Visibility changed to false/true"}},
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
            query = query | client_user.client.assignments.all()
        return query.filter(visible=True)

    @action(detail=True, methods=["get"])
    def complete(self, request, pk):
        """Смена статуса задачи на 'done'"""
        assignment = self.get_object()
        assignment.status = "done"
        assignment.save()
        return Response({"message": "Status is 'done'"})

    @action(detail=True, methods=["get"])
    def clear(self, request, pk):
        """Очистка ответов в задании клиента"""
        assignment = self.get_object()

        if assignment.status == "to do":
            return Response({"message": "No cleaning required. Status is 'to do'"})

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
        return Response({"message": "Assignments cleared successfully"})

    @action(detail=True, methods=["POST"])
    def visible(self, request, pk):
        """Смена значения видимости задания для доктора"""
        assignment = self.get_object()
        assignment.visible = not assignment.visible
        assignment.save()
        return Response({"message": f"Visibility changed to {assignment.visible}"})


# TODO : To be added, not implemented in V1
class NoteViewSet(viewsets.ModelViewSet):
    """CRUD операции над заметками"""

    queryset = Note.objects.all()
    serializer_class = NoteSerializer


@extend_schema_view(
    list=extend_schema(tags=["Diaries"], summary="Get diary notes"),
    retrieve=extend_schema(tags=["Diaries"], summary="Get diary note by id"),
    create=extend_schema(tags=["Diaries"], summary="Create diary note"),
    destroy=extend_schema(tags=["Diaries"], summary="Delete diary note"),
    update=extend_schema(
        tags=["Diaries"],
        summary="Update diary note",
        description="Deletes values of non passed fields",
    ),
    partial_update=extend_schema(tags=["Diaries"], summary="Update diary note"),
    visible=extend_schema(tags=["Diaries"], summary="Change diary note visibility"),
)
class DiaryNoteViewSet(viewsets.ModelViewSet):
    """CRUD операции над заметками в дневнике"""

    # TODO: ограничить выдачу по связке доктор-заметки его клиентов
    queryset = DiaryNote.objects.filter(visible=True)
    serializer_class = DiaryNoteSerializer
    filterset_fields = [
        "author",
    ]
    permission_classes = (AssignmentDiaryDoctorOnly,)

    def get_queryset(self):
        user = self.request.user
        if user.user_type == USER_TYPES[0]:
            return DiaryNote.objects.filter(author=user)
        return super().get_queryset()

    @action(detail=True, methods=["POST"])
    def visible(self, request, pk):
        """Смена значения видимости записи в дневнике для доктора"""
        diary_note = self.get_object()
        diary_note.visible = not diary_note.visible
        diary_note.save()
        return Response({"message": f"Visibility changed to {diary_note.visible}"})


@require_GET
def assetlink(request):
    path = f"{settings.STATIC_ROOT}/assetlinks.json"
    with open(path, "r") as f:
        data = json.loads(f.read())
    response = JsonResponse(data, safe=False)
    return response
